package net.sherwin.cvstool.model.data;

import java.io.File;

public class DirPair {
	public File dir1;
	public File dir2;
	
	public DirPair(FileInfo dir1, FileInfo dir2) {
		this.dir1 = new File(dir1.fullpathName);
		this.dir2 = new File(dir2.fullpathName);
	}
	
	public DirPair(String dir1, String dir2) {
		this.dir1 = new File(dir1);
		this.dir2 = new File(dir2);
	}
}