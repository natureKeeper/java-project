package org.danny.project.cvspatcher;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.types.Path;


/**
 * <p>Copyright: GuoXin Lucent</p>
 * <p>Description: </p>
 * <p>@author dba88</p>
 * <p>@version 1.0</p>
 * 一个验证补丁依赖的扩展，提供要提交的补丁目录和待提交的补丁目录，分析是否有要提交的补丁依赖某待提交的补丁，有则报错
 * 再分析是否有待提交补丁时间点早于要提交的补丁，提示用户把待提交补丁里过期的文件删除，避免时间早的覆盖时间晚的
<patchValidater branch="branch1" fileEncoding="UTF-8">
	<commitingBugfixPaths>
		<fileset dir="./patches" includes="1.txt" />
		<fileset dir="./patches" includes="2.txt" />
	</commitingBugfixPaths>
	<uncommitBugfixPaths>
		<fileset dir="./patches" includes="1.txt" />
		<fileset dir="./patches" includes="2.txt" />
	</uncommitBugfixPaths>
</patchValidater>
 */
public class PatchValidater extends Task {

	private Vector commitingBugfixPaths = new Vector();
	
	private Vector uncommitBugfixPaths = new Vector();
	
	private String fileEncoding;

	private String branch;

	public void addCommitingBugfixPaths(Path path) {
		commitingBugfixPaths.add(path);
	}
	
	public void addUncommitBugfixPaths(Path path) {
		uncommitBugfixPaths.add(path);
	}

	public void execute() {
		try {
			this.validate();
			Map commitingFiles = this.readAllPatches(this.listFileNames(commitingBugfixPaths), true);
			Map uncommitFiles = this.readAllPatches(this.listFileNames(uncommitBugfixPaths), false);		
			this.analyze(commitingFiles, uncommitFiles);
			log("analyze success");
		} catch (Exception e) {
			e.printStackTrace();
			throw new BuildException(e);
		}
	}
	
	protected boolean analyze(Map commitingFiles, Map uncommitFiles) throws Exception {
		Patch commitingPatch = null;
		Patch uncommitPatch = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		Set set = commitingFiles.entrySet();
		
		for(Iterator it = set.iterator();it.hasNext();) {
			Map.Entry entry = (Map.Entry)it.next();
			String fileName = (String)entry.getKey();
			
			if(uncommitFiles.containsKey(fileName)) {
				commitingPatch = (Patch)entry.getValue();
				uncommitPatch = (Patch)uncommitFiles.get(fileName);

				/*
				 * 比较版本号,delete是"最大的"版本号
				 * 提交的文件的版本号要比未提交的早
				 */
				{
					if ("delete".equals(uncommitPatch.versionNum)) {
						continue;
					}
					
					if ("delete".equals(commitingPatch.versionNum)) {
						throw new BuildException("\r\nsrcFile Conflict:\r\n" + 
								"\tsrcFileName: " + uncommitPatch.fileName + "\r\n" +
								"\tcommiting file: " + commitingPatch.bugfixNo + "\r\n" +
								"\tuncommit file: " + uncommitPatch.bugfixNo + "\r\n");
					}

					String[] commitingPatchVersionArray = commitingPatch.versionNum.split("\\.");
					String[] uncommitPatchVersionArray = uncommitPatch.versionNum.split("\\.");
					
					if (commitingPatchVersionArray.length != uncommitPatchVersionArray.length) {
						throw new BuildException("File " + commitingPatch.fileName + 
								" version length mismatch: " + commitingPatch.versionNum + " <-> " + uncommitPatch.versionNum);
					}
					
					for (int i=0; i<commitingPatchVersionArray.length; i++) {
						if (i != commitingPatchVersionArray.length-1) {
							if (!commitingPatchVersionArray[i].equals(uncommitPatchVersionArray[i])) {
								throw new BuildException("File " + commitingPatch.fileName + 
										" branch mismatch: " + commitingPatch.versionNum + " <-> " + uncommitPatch.versionNum);
							}
						} else {
							int commiting = Integer.parseInt(commitingPatchVersionArray[i]);
							int uncommit = Integer.parseInt(uncommitPatchVersionArray[i]);
							if (commiting > uncommit) {
								throw new BuildException("\r\nsrcFile Conflict:\r\n" + 
										"\tsrcFileName: " + uncommitPatch.fileName + "\r\n" +
										"\tcommiting file: " + commitingPatch.bugfixNo + "\r\n" +
										"\tuncommit file: " + uncommitPatch.bugfixNo + "\r\n");
							}
						}
					}
				}
			}
		}
		
		return true;
	}

	/*
	 * 读取目录下的文件名，并用list返回文件名
	 */
	protected List listFileNames(Vector paths) {
		List fileNames = new ArrayList();
		for (Iterator itPaths = paths.iterator(); itPaths.hasNext();) {
			Path path = (Path) itPaths.next();
			String[] includedFiles = path.list();
			for (int i = 0; i < includedFiles.length; i++) {
				String fileName = includedFiles[i].replace('\\', '/');
				fileNames.add(fileName);
			}
		}
		return fileNames;
	}

	/*
	 * 读取所有文件里的补丁文件名并用list返回这些名字
	 */
	protected Map readAllPatches(List fileNames, boolean getLargeVersion) {
		if (null == fileNames) {
			return null;
		}

		Map allPatches = new HashMap();
		
		log("Begin to collect patches...");
		for (Iterator it = fileNames.iterator(); it.hasNext();) {
			String fileName = (String) it.next();
			File file = new File(fileName);
			Map patches = this.readPatches(file, allPatches, getLargeVersion);
			log("scaned file: " + fileName);
		}
		return allPatches;
	}

	/*
	 * 读取bugfix文件中的所有补丁文件名并用list返回这些名称
	 */
	protected Map readPatches(File file, Map patches, boolean getLargeVersion) {
		if (null == file) {
			return null;
		}
		if (!file.exists()) {
			throw new BuildException("File " + file.getName()
					+ " doesn't exist.");
		}
		if (file.isDirectory()) {
			throw new BuildException("File " + file.getName()
					+ " is a directory.");
		}

		FileInputStream fs = null;
		try {
			fs = new FileInputStream(file);
			fileEncoding = (fileEncoding != null & !"".equals(fileEncoding))?fileEncoding:"GB2312";
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					fs, fileEncoding));

			String line = null;
			String branchNames = null;

			while (null != (line = reader.readLine())) {
				if (line.startsWith("#")) {
					continue;
				}

				//如果要打补丁的branch名字不在补丁文件描述的branchNames列表里，则忽略这个补丁
				if (line.startsWith("Branch:")) {
					branchNames = line.substring(7);// ex:
												// branchNames=head,branch1,branch2
					if (branchNames.indexOf(branch) < 0) {
						return patches;
					}
					continue;
				}
				
				if (line.startsWith("Time:")) {
					continue;
				}

				if ("".equals(line)) {
					continue;
				}
				
				if (null == branchNames || 0 >= branchNames.length()) {
					throw new BuildException("Missing branch name in file "
							+ file.getName());
				}
				
				String[] strs = line.split("\t");
				String fileName = strs[0];
				String versionNum = "";
				if(strs.length > 1) {
					versionNum = strs[1];
				}
				
				if (patches.containsKey(fileName)) {
					// 如果已经有这个补丁，则使用最新的分支号那个
					Patch prePatch = (Patch) patches.get(fileName);

					/*
					 * 比较版本号,delete是"最大的"版本号
					 */
					if (getLargeVersion) {
						if ("delete".equals(prePatch.versionNum)) {
							continue;
						}
						
						if ("delete".equals(versionNum)) {
							prePatch.branchName = branch;
							prePatch.bugfixNo += ";" + file.getName();
							prePatch.fileName = fileName;
							prePatch.versionNum = versionNum;
							continue;
						}
					} else {
						if ("delete".equals(versionNum)) {
							continue;
						}
						
						if ("delete".equals(prePatch.versionNum)) {
							prePatch.branchName = branch;
							prePatch.bugfixNo += ";" + file.getName();
							prePatch.fileName = fileName;
							prePatch.versionNum = versionNum;
							continue;
						}
					}

					String[] currVersionArray = versionNum.split("\\.");						
					String[] preVersionArray = prePatch.versionNum.split("\\.");
					
					if (currVersionArray.length != preVersionArray.length) {
						throw new BuildException("File " + file.getName() + 
								" version length mismatch: " + versionNum + " <-> " + prePatch.versionNum);
					}
					
					for (int i=0; i<currVersionArray.length; i++) {
						if (i != currVersionArray.length-1) {
							if (!currVersionArray[i].equals(preVersionArray[i])) {
								throw new BuildException("File " + file.getName() + 
										" branch mismatch: " + versionNum + " <-> " + prePatch.versionNum);
							}
						} else {
							int curr = Integer.parseInt(currVersionArray[i]);
							int pre = Integer.parseInt(preVersionArray[i]);
							
							if (getLargeVersion) {
								if (curr > pre) {
									prePatch.branchName = branch;
									prePatch.bugfixNo += ";" + file.getName();
									prePatch.fileName = fileName;
									prePatch.versionNum = versionNum;
								}
							} else {
								if (curr < pre) {
									prePatch.branchName = branch;
									prePatch.bugfixNo += ";" + file.getName();
									prePatch.fileName = fileName;
									prePatch.versionNum = versionNum;
								}
							}
							
						}
					}
				} else {
					patches.put(fileName, new Patch(file.getName(), fileName, branchNames, versionNum, null/*time*/));
				}
			}
		} catch (Exception e) {
			throw new BuildException(e);
		} finally {
			if (null != fs) {
				try {
					fs.close();
				} catch (IOException e) {
				}
				fs = null;
			}
		}
		return patches;
	}

	protected void validate() {
		if (commitingBugfixPaths.size() < 1)
			throw new BuildException("commitingBugfixPaths not set");
		
		if (uncommitBugfixPaths.size() < 1)
			throw new BuildException("uncommitBugfixPaths not set");
		
		if (null == branch || "".equals(branch)) {
			branch = "head";
			log("Task not set branch param,make default to be head");
		}
	}

	final class Patch {
		String bugfixNo;
		String branchName;
		String time;
		String fileName;
		String versionNum;

		public Patch(String bugfixNo, String fileName, String branchName, String versionNum, String time) {
			this.bugfixNo = bugfixNo;
			this.branchName = branchName;
			this.time = time;
			this.fileName = fileName;
			this.versionNum = versionNum;
		}
	}

	public void setFileEncoding(String fileEncoding) {
		this.fileEncoding = fileEncoding;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}
	
	static public void main(String[] args) {
		PatchValidater pv = new PatchValidater();
		pv.branch = "head";
		pv.fileEncoding = "GB2312";

	}

}
