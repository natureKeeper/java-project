package net.sherwin.common.io;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;

public class FileUtil {
	
	private static final int BUFFER_SIZE = 4096;

	public static void save(String content, File file) throws IOException {
		byte[] bytes = content.getBytes();
		save(bytes, file);
	}

	public static void save(byte[] content, File file) throws IOException {
		BufferedOutputStream bos = null;
		BufferedInputStream bis = null;

		try {
			bos = new BufferedOutputStream(new FileOutputStream(file));
			bis = new BufferedInputStream(new ByteArrayInputStream(content));
			byte[] buffer = new byte[1024];
			int len = 0;
			while ((len = bis.read(buffer)) != -1) {
				bos.write(buffer, 0, len);
			}
		} finally {
			if (null != bos) {
				bos.close();
			}
			if (null != bis) {
				bis.close();
			}
		}
	}

	public static String readFileAsString(File file) {
		byte[] bytes = readFileAsBytes(file);
		return new String(bytes);
	}

	public static byte[] readFileAsBytes(File file) {
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(file);
			int length = fis.available();
			byte[] bytes = new byte[length];
			fis.read(bytes);			
			return bytes;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (null != fis) {
				try {
					fis.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				fis = null;
			}
		}
		return new byte[0];
	}
	
	public static List<String> readTxtFileAsStrings(File file) {
		List<String> lines = new ArrayList<String>();
		BufferedReader br = null;
		try {
			br = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
			String line = null;
			while (null != (line = br.readLine())) {
				lines.add(line);
			}			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (null != br) {
				try {
					br.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				br = null;
			}
		}
		return lines;
	}

	public static File copyFile(String sourceFilePath, String destFilePath) {
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;

		String destPathStr = destFilePath.substring(0, destFilePath.lastIndexOf("\\"));
		File destPath = new File(destPathStr);
		destPath.mkdirs();

		File sourceFile = new File(sourceFilePath);
		File destFile = new File(destFilePath);

		try {
			bis = new BufferedInputStream(new FileInputStream(sourceFile));
			bos = new BufferedOutputStream(new FileOutputStream(destFile));

			int size = BUFFER_SIZE;
			byte[] buf = new byte[size];
			int off = 0;
			int len = 0;
			while ((len = bis.read(buf, 0, size)) > 0) {
				bos.write(buf, 0, len);
				bos.flush();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (bis != null)
				try {
					bis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			if (bos != null)
				try {
					bos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
		return destFile;
	}

	public static File copyFile(File srcFile, File destFile, boolean overwrite) throws IOException {
		/*
		 * 检查源文件是否可复制
		 */
		if (!srcFile.exists())
			abort("no such source file: " + srcFile.getName());
		if (!srcFile.isFile())
			abort("can't copy directory: " + srcFile.getName());
		if (!srcFile.canRead())
			abort("source file is unreadable: " + srcFile.getName());

		/*
		 * 目标是目录的话，则在目录下创建文件
		 */
		if (destFile.isDirectory()) {
			destFile = new File(destFile, srcFile.getName());
		}
			

		/*
		 * 目标存在要判断是否覆盖
		 * 不存在要判断路径是否有效
		 */
		if (destFile.exists()) {
			if (!destFile.canWrite()) {
				abort("destination file is unwriteable: " + destFile.getName());
			}
				
			if (!overwrite) {
				abort("existing file was not overwritten.");
			}
		} else {
			String parent = destFile.getParent();
			if (parent == null) {
				parent = System.getProperty("user.dir");
			}
				
			File dir = new File(parent);
			if (!dir.exists())
				abort("destination directory doesn't exist: " + parent);
			if (dir.isFile())
				abort("destination is not a directory: " + parent);
			if (!dir.canWrite())
				abort("destination directory is unwriteable: " + parent);
		}

		/*
		 * 从源文件读取一个块到缓冲区 把缓冲区内容写入目标文件 直到读取到文件尾
		 */
		FileInputStream from = null;
		FileOutputStream to = null;
		try {
			from = new FileInputStream(srcFile);
			to = new FileOutputStream(destFile);
			byte[] buffer = new byte[BUFFER_SIZE];
			int bytes_read;

			while (-1 != (bytes_read = from.read(buffer))) {
				to.write(buffer, 0, bytes_read);
			}
			return destFile;
		} finally {
			if (from != null) {
				try {
					from.close();
					from = null;
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			if (to != null) {
				try {
					to.close();
					to = null;
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * 计算dir以及file的全路径
	 * 把file的全路径减去dir的全路径，得到一个子路径，返回这个子路径
	 * @param dir
	 * @param file
	 * @return
	 */
	public static String subPath(File dir, File file) {
		String dirPath = dir.getAbsolutePath() + File.separator;
		String filePath = file.getAbsolutePath();
		String subPath = StringUtils.substringAfter(filePath, dirPath);
		return subPath;
	}

	private static void abort(String msg) throws IOException {
		throw new IOException("FileCopy: " + msg);
	}

}
