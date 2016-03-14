package com.irm.utils.syncdb;
import java.io.File;


/**
 * 把一个根目录下（包括子目录）所有文件移动到另一个目录里
 * @author Administrator
 *
 */
public class GetAllFilesToOneDir {
	public static void main(String[] args) throws Exception {
		System.out.println("本程序功能是把一个根目录下（包括子目录）所有文件移动到另一个目录里");
		String srcDirName = "D:/tmp/升级数据库脚本工作区/原版scripts";
		String destDirName = "D:/tmp/升级数据库脚本工作区/删除重复scripts后结果";
		
		System.out.println("要提取文件的根目录是: " + srcDirName);
		System.out.println("目标根目录是                    : " + destDirName);
		System.out.println("确认请按任意键");
		
		System.in.read();
		
		File srcDir = new File(srcDirName);
		srcDir.mkdirs();
		
		File destDir = new File(destDirName);
		destDir.mkdirs();

		findFiles(srcDir, destDir);
		
		System.out.println("移动文件结束");
	}
	
	public static void findFiles(File root, File destDir) throws Exception {
		File[] subDirs = root.listFiles();
		if (null != subDirs) {
			for (int i=0; i<subDirs.length; i++) {
				File file = subDirs[i];
				if (file.isFile()) {
					move(file, destDir);
				} else {
					findFiles(file, destDir);
				}
			}
		}
	}
	
	public static void move(File file, File destDir) throws Exception {
		String fileName = file.getName();
		String path = destDir.getAbsolutePath();
		String destPathName = path + File.separator + fileName;
		
		File destFile = new File(destPathName);
		if (!file.renameTo(destFile)) {
			throw new Exception("文件移动失败：" + file.getAbsolutePath() + " To " + destFile.getAbsolutePath());
		}
	}
}
