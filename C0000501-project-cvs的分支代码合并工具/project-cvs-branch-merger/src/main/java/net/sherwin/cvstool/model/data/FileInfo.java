package net.sherwin.cvstool.model.data;

public class FileInfo {
	public String fullpathName;//全路径名
	public boolean isFile;//是文件还是文件夹
	public boolean isCvsFile;//是否在cvs管理中
	public boolean localModified;//是否本地修改过
	
	public FileInfo(String fpname, boolean isFile, boolean isCvsFile, boolean localModified) {
		fullpathName = fpname;
		this.isFile = isFile;
		this.isCvsFile = isCvsFile;
		this.localModified = localModified;
	}
}