package org.danny.project.cvspatcher;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Target;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Cvs;
import org.apache.tools.ant.types.Path;

/**
 * 
 * <p>Copyright: GuoXin Lucent</p>
 * <p>Description: </p>
 * <p>@author dba88</p>
 * <p>@version 1.0</p>
 * info: 一个cvs下载文件扩展，可以下载补丁文件里指定的cvs文件
 * 		要执行这个任务必须要cvs程序在执行路径，不然会报error=2
 * example:
<cvsExt cvsroot="xx" dest="xx" command="xx" branch="branch1" passfile="xx" fileEncoding="UTF-8" tmpdir="xx">
	<path>
		<fileset dir="./patches" includes="1.txt" />
		<fileset dir="./patches" includes="2.txt" />
	</path>
</cvsExt>
 */
public class CvsUpdateExt extends Task {

	protected Vector paths = new Vector();

	protected String cvsroot;

	protected String dest;

	protected String command;

	protected String passfile;

	protected String branch;
	
	protected String fileEncoding;
	
	protected String tmpdir;
	
	protected boolean failOnError = true;
	
	static final String HEAD = "head";

	public void addPath(Path path) {
		paths.add(path);
	}

	public void execute() {
		try {
			validate();
			List fileNames = listFileNames();
			Map patches = this.readAllPatches(fileNames);
			this.batchUpdateFromCvs(patches);
		} catch(Exception e) {
			e.printStackTrace();
			throw new BuildException(e);
		}		
	}

	/*
	 * 根据补丁文件名列表逐个下载补丁文件
	 */
	protected void batchUpdateFromCvs(Map patches) {
		log("Begin to download...");
		log("Branch: " + branch);
		if (null != patches && 0 < patches.size()) {
			Set patchSet = patches.entrySet();
			for (Iterator it = patchSet.iterator(); it.hasNext();) {
				Map.Entry entry = (Map.Entry) it.next();
				String patchName = (String) entry.getKey();
				Patch patchInfo = (Patch) entry.getValue();

				this.updateFromCvs(patchName, patchInfo);
			}
		}
	}

	/*
	 * 根据补丁文件名下载补丁文件
	 */
	protected void updateFromCvs(String patchName, Patch patchInfo) {
		final class MyCvs extends Cvs {
			public MyCvs() {
				project = new Project();
				project.init();
				target = new Target();
			}
		}
		
		String realCmd = command;
		
//		if(!this.HEAD.equals(branch)) {
//			realCmd = command + " -r " + branch;
//		}
		
		if ("delete".equals(patchInfo.version)) {
			return;
		}
		
		realCmd = realCmd + " -r" + patchInfo.version + " " + patchName;
		log(realCmd);
		
		String parentPath = patchName.substring(0,patchName.lastIndexOf("/"));
		File parentDir = new File(dest + "/" + parentPath);
		parentDir.mkdirs();
		
		MyCvs myCvs = new MyCvs();
		myCvs.setCvsRoot(cvsroot);
		myCvs.setCommand(realCmd);
		myCvs.setDest(new File(tmpdir));
		myCvs.setPassfile(new File(passfile));
		myCvs.setFailOnError(failOnError);
		myCvs.setPackage(patchName);
		myCvs.setOutput(new File(dest + "/" + patchName));
		myCvs.execute();

		File f = new File(dest + '/' + patchName);
		if (f.exists()) {
			log("Downloaded file \r\n" +
					"\tsrcFileName: " + patchName + 
					"\tpatchName: " + patchInfo.bugfixNo + "\r\n");
		} else {
			throw new BuildException("Error, file download fail\r\n" +
					"\tsrcFileName: " + patchName + 
					"\tpatchName: " + patchInfo.bugfixNo + "\r\n");
		}
	}

	/*
	 * 读取bugfix目录下的bugfix文件名，并用list返回文件名
	 */
	protected List listFileNames() {
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
	 * 读取所有bugfix文件里的补丁文件名并用list返回这些名字
	 */
	protected Map readAllPatches(List fileNames) {
		if (null == fileNames) {
			return null;
		}

		Map allPatches = new HashMap();
		
		log("Begin to collect patches...");
		for (Iterator it = fileNames.iterator(); it.hasNext();) {
			String fileName = (String) it.next();
			File file = new File(fileName);
			Map patches = this.readPatches(file, allPatches);
		}
		return allPatches;
	}

	/*
	 * 读取bugfix文件中的所有补丁文件名并用list返回这些名称
	 */
	protected Map readPatches(File file, Map patches) {
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
		if (!file.canRead()) {
			throw new BuildException("File " + file.getName() + " can't read.");
		}

		FileInputStream fs = null;
		try {
			fs = new FileInputStream(file);
			
			fileEncoding = (fileEncoding != null & !"".equals(fileEncoding))?fileEncoding:"GB2312";
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					fs, fileEncoding));

			String line = null;
			String branchName = null;

			while (null != (line = reader.readLine())) {
				if (line.startsWith("#")) {
					continue;
				}

				if (line.startsWith("Branch:")) {
					branchName = line.substring(7);// ex: version=head,branch1,branch2
					if (branchName.indexOf(branch) < 0) {
						throw new BuildException(
								"branchName error:\r\n" +
								"\tpatchName:" + file.getName());
					}
					continue;
				}
				
				if (line.startsWith("Time:")) {
					continue;
				}

				if ("".equals(line)) {
					continue;
				}
				
				if (null == branchName || 0 >= branchName.length()) {
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
					
					// 如果已经有这个补丁，则使用最新的时间那个
					Patch prePatch = (Patch) patches.get(fileName);

					log("Patch Duplicated: \r\n" +
							"\tsrcFileName: " + fileName + "\r\n" +
							"\tpatchName: " + file.getName() + "\r\n" + 
							"\tpatchName: " + prePatch.bugfixNo + "\r\n");
					
					if ("delete".equals(prePatch.version)) {
						continue;
					}
					
					if ("delete".equals(versionNum)) {
						prePatch.branchName = branchName;
						prePatch.bugfixNo += ";" + file.getName();
						prePatch.fileName = fileName;
						prePatch.version = versionNum;
						continue;
					}
					
					String[] prePatchVersion = prePatch.version.split("\\.");
					String[] currVersion = versionNum.split("\\.");
					
					if (prePatchVersion.length != currVersion.length) {
						throw new BuildException("File " + prePatch.fileName + 
								" version length mismatch: " + prePatch.version + " <-> " + versionNum);
					}
					
					for (int i=0; i<prePatchVersion.length; i++) {
						if (i != prePatchVersion.length-1) {
							if (!prePatchVersion[i].equals(currVersion[i])) {
								throw new BuildException("File " + prePatch.fileName + 
										" branch mismatch: " + prePatch.version + " <-> " + versionNum);
							}
						} else {
							int pre = Integer.parseInt(prePatchVersion[i]);
							int curr = Integer.parseInt(currVersion[i]);
							if (curr > pre) {
								prePatch.branchName = branchName;
								prePatch.bugfixNo += ";" + file.getName();
								prePatch.fileName = fileName;
								prePatch.version = versionNum;
							}
						}
					}
				} else {
					patches.put(fileName, new Patch(file.getName(), branchName, null/*time*/,
							fileName, versionNum));
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
		if (paths.size() < 1)
			throw new BuildException("fileset not set");
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
		String version;

		public Patch(String b, String branch, String t, String f, String ver) {
			bugfixNo = b;
			branchName = branch;
			time = t;
			fileName = f;
			version = ver;
		}
	}

	public void setCvsroot(String cvsroot) {
		this.cvsroot = cvsroot;
	}

	public void setDest(String dest) {
		this.dest = dest;
	}

	public void setCommand(String command) {
		this.command = command;
	}

	public void setPassfile(String passfile) {
		this.passfile = passfile;
	}

	public void setPaths(Vector paths) {
		this.paths = paths;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public void setFailOnError(boolean failOnError) {
		this.failOnError = failOnError;
	}

	public void setFileEncoding(String fileEncoding) {
		this.fileEncoding = fileEncoding;
	}

	public void setTmpdir(String tmpdir) {
		this.tmpdir = tmpdir;
	}

}
