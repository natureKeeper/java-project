package org.danny.project.cvspatcher;
import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.types.FilterSet;
//import org.sherwin.cvspatcher.CvsUpdateExt.Patch;

/**
 * 
 * <p>Copyright: GuoXin Lucent</p>
 * <p>Description: </p>
 * <p>@author dba88</p>
 * <p>@version 1.0</p>
 * info: 删除被delete的源文件
 * example:
<patchRemover dest="xx" branch="branch1" fileEncoding="UTF-8">
	<path>
		<fileset dir="./patches" includes="1.txt" />
		<fileset dir="./patches" includes="2.txt" />
	</path>
</patchRemover>
 */
public class DeletedPatchRemover extends CvsUpdateExt {

	protected Vector filterSets = new Vector();
	
	protected Map filters = new HashMap();

	public void addFilterSet(FilterSet filterSet) {
		filterSets.add(filterSet);
	}
	
	public void execute() {
		try {
			validate();
			List fileNames = listFileNames();
			Map patches = this.readAllPatches(fileNames);
			this.removePatches(patches);
		} catch(Exception e) {
			e.printStackTrace();
			throw new BuildException(e);
		}		
	}
	
	protected void removePatches(Map patches) {
		log("Begin to remove patches...");
		log("Branch: " + branch);
		
		if (null != patches && 0 < patches.size()) {
			Set patchSet = patches.entrySet();
			for (Iterator it = patchSet.iterator(); it.hasNext();) {
				Map.Entry entry = (Map.Entry) it.next();
				String patchName = (String) entry.getKey();
				Patch patchInfo = (Patch) entry.getValue();

				this.removePatch(patchName, patchInfo);
			}
		}
	}
	
	protected void removePatch(String patchName, Patch patchInfo) {
		if (!"delete".equals(patchInfo.version)) {
			return;
		}
		
		String patchFilterName = null;
		for (Iterator it=filterSets.iterator(); ( null==patchFilterName && it.hasNext() ); ) {
			FilterSet fs = (FilterSet)it.next();
			patchFilterName = fs.replaceTokens(patchName);
		}

		File f = new File(dest + '/' + patchFilterName);
		if (!f.exists()) {
			log("MESSAGE, file doesn't exists\r\n" +
					"\tsrcFileName: " + patchName + 
					"\tpatchName: " + patchInfo.bugfixNo + 
					"\tfilterSrcFileName: " + dest + '/' + patchFilterName);
			return;
		}

		if (!f.canWrite()) {
			throw new BuildException("Error, file can't read\r\n" +
					"\tsrcFileName: " + patchName + 
					"\tpatchName: " + patchInfo.bugfixNo + "\r\n");
		}

		if (f.isDirectory()) {
			throw new BuildException("Error, file is a directory\r\n" +
					"\tsrcFileName: " + patchName + 
					"\tpatchName: " + patchInfo.bugfixNo + "\r\n");
		}

		boolean success = f.delete();

		if (!success) {
			throw new BuildException("Error, delete file failed\r\n" +
					"\tsrcFileName: " + patchName + 
					"\tpatchName: " + patchInfo.bugfixNo + "\r\n");
		} else {
			log("Removed file \r\n" +
					"\tsrcFileName: " + patchName + 
					"\tpatchName: " + patchInfo.bugfixNo + "\r\n");
		}
	}

}
