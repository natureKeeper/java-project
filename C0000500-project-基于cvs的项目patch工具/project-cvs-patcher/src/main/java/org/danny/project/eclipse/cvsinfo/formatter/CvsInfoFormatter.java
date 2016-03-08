package org.danny.project.eclipse.cvsinfo.formatter;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class CvsInfoFormatter {
	
	String[] ignoreKey = {"#","Branch:","Time:"};
	String cvsPath = "/";
	String encoding = "GB2312";
	String regExp1 = "^(Time|Branch|#).*";
	
	String outputPath;
	String backupPath;
	
//	String regExp3 = "Removing.*";
	
	/**
	 * 扫描读入的每行，如果符合正则式1则原样输出，符合补丁文件路径规则则截取输出，否则忽略
	 * @param input
	 * @param output
	 * @throws IOException
	 */
	void convertFileContent(BufferedReader input, BufferedWriter output) throws IOException {
		
		String line = null;
		
		String regExp2 = "^" + cvsPath + ".+,v.+<--.*";
		
		Pattern p1 = Pattern.compile(regExp1);
		
		Pattern p2 = Pattern.compile(regExp2);
		
//		Pattern p3 = Pattern.compile(regExp3);
		
//		boolean removing = false;
		
		while(null != (line = input.readLine())) {
			line = line.trim();
			
//			Matcher m3 = p3.matcher(line);
//			if(m3.matches()) {
//				removing = true;
//				continue;
//			}
			
			Matcher m1 = p1.matcher(line);
			if(m1.matches()) {
				output.write(line);
				output.newLine();
				continue;
			}
			
			Matcher m2 = p2.matcher(line);
			if(m2.matches()) {
//				if(true == removing) {
//					removing = false;
//					continue;
//				}
				String filePath = line.substring(0,line.indexOf(",v"));
				filePath = filePath.substring(cvsPath.length() + 1);
				
				String action = input.readLine().trim();
				
				//14 is "new revision: "的长度
				if(action.startsWith("new revision:")) {
					output.write(filePath);
					output.write("\t" + action.substring(14,action.indexOf(";")));
				}else if(action.startsWith("initial revision:")) {
					output.write(filePath);
					output.write("\t" + action.substring(18));
				}
				
				output.newLine();
			}
		}
	}
	
	void convertFile(String filePath,String fileName) throws Exception {
		String originFileName = filePath + '/' + fileName;
		String outputFileName = outputPath + "/" + fileName + ".rtf";
		String backupFileName = backupPath + "/" + fileName;
		
		File f = new File(originFileName);
		if(!f.exists()) {
			throw new FileNotFoundException(originFileName);
		}
		if(!f.isFile()) {
			throw new Exception(originFileName + " isn't a file");
		}
		
		BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(f),encoding));
		
		File output = new File(outputFileName);
		OutputStream os = new FileOutputStream(output);
		BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(os));
		
		this.convertFileContent(br, bw);
		bw.flush();
		bw.close();
		
		br.close();
		f = null;
		
		this.copy(originFileName, backupFileName);
		this.delete(originFileName);
		
	}
	
	
    private void copy(String from_name, String to_name) throws IOException {
		File from_file = new File(from_name); // Get File objects from Strings
		File to_file = new File(to_name);

		// First make sure the source file exists, is a file, and is readable.
		if (!from_file.exists())
			abort("no such source file: " + from_name);
		if (!from_file.isFile())
			abort("can't copy directory: " + from_name);
		if (!from_file.canRead())
			abort("source file is unreadable: " + from_name);

		if (to_file.isDirectory())
			to_file = new File(to_file, from_file.getName());

		if (to_file.exists()) {
			if (!to_file.canWrite())
				abort("destination file is unwriteable: " + to_name);
			// Ask whether to overwrite it
			System.out.print("Overwrite existing file " + to_file.getName() + "? (Y/N): ");
			System.out.flush();
			// Get the user's response.
			BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
			String response = in.readLine();
			// Check the response. If not a Yes, abort the copy.
			if (!response.equals("Y") && !response.equals("y"))
				abort("existing file was not overwritten.");
		} else {

			String parent = to_file.getParent(); // The destination directory
			if (parent == null) // If none, use the current directory
				parent = System.getProperty("user.dir");
			File dir = new File(parent); // Convert it to a file.
			if (!dir.exists())
				abort("destination directory doesn't exist: " + parent);
			if (dir.isFile())
				abort("destination is not a directory: " + parent);
			if (!dir.canWrite())
				abort("destination directory is unwriteable: " + parent);
		}

		FileInputStream from = null; // Stream to read from source
		FileOutputStream to = null; // Stream to write to destination
		try {
			from = new FileInputStream(from_file); // Create input stream
			to = new FileOutputStream(to_file); // Create output stream
			byte[] buffer = new byte[4096]; // To hold file contents
			int bytes_read; // How many bytes in buffer

			while ((bytes_read = from.read(buffer)) != -1)
				// Read until EOF
				to.write(buffer, 0, bytes_read); // write
		}
		// Always close the streams, even if exceptions were thrown
		finally {
			if (from != null)
				try {
					from.close();
				} catch (IOException e) {
					;
				}
			if (to != null)
				try {
					to.close();
				} catch (IOException e) {
					;
				}
		}
		
		System.out.println("backuped file: " + from_name + " to " + to_name);
	}
    
    private void delete(String filename) throws IOException {
		// Create a File object to represent the filename
		File f = new File(filename);

		// Make sure the file or directory exists and isn't write protected
		if (!f.exists())
			abort("Delete: no such file or directory: " + filename);
		if (!f.canWrite())
			abort("Delete: write protected: " + filename);

		// If it is a directory, make sure it is empty
		if (f.isDirectory()) {
			String[] files = f.list();
			if (files.length > 0)
				abort("Delete: directory not empty: " + filename);
		}

		// If we passed all the tests, then attempt to delete it
		boolean success = f.delete();

		if (!success)
			abort("Delete: deletion failed");
		
		System.out.println("deleted file: " + filename);
	}
    
    private void abort(String msg) throws IOException { 
        throw new IOException(msg); 
    }
    

	
	public static void main(String[] args) throws Exception {
		CvsInfoFormatter obj = new CvsInfoFormatter();
		
		FileInputStream fis = new FileInputStream(new File("formatter.properties"));
		Properties prop = new Properties();
		prop.load(fis);
		obj.encoding = prop.getProperty("encoding", "GB2312");
		obj.cvsPath = prop.getProperty("cvsPath","/");
		obj.outputPath = prop.getProperty("outputPath","c:/output");
		obj.backupPath = prop.getProperty("backupPath","c:/backup");
		String patchRoot = prop.getProperty("filePath", "c:/");
		
		System.out.println("###########################################");
		System.out.println("encoding: " + obj.encoding);
		System.out.println("cvsPath: " + obj.cvsPath);
		System.out.println("outputPath: " + obj.outputPath);
		System.out.println("backupPath: " + obj.backupPath);
		System.out.println("patchRoot: " + patchRoot);
		System.out.println("###########################################");
		System.out.println();
		System.out.println();
		
//		String root = obj.getClass().getResource(patchRoot).getPath();
		File dir = new File(patchRoot);
		String[] patchFiles = dir.list();
		for(int i = 0;i < patchFiles.length;i++) {
			if(patchFiles[i].endsWith(".txt")){
				String fileName = patchFiles[i];
				File f = new File(patchRoot + '/' + fileName);
				if(f.isFile()){
					obj.convertFile(patchRoot,fileName);
					System.out.println("converted file: " + patchRoot + '/' + fileName);
					System.out.println("successfull!");
					System.out.println("");
				}
			}						
		}

	}
	/*
	 * 读配置，设置模式头，模式尾，不变的模式头
	 * 读目录
	 * 读文件
	 * 建文件tmp
	 * 扫描文件
	 * 关闭tmp
	 * 关闭文件
	 * 文件变bak
	 * tmp变文件
	 */
	
	/*
	 * #开头的不变
	 * Branch：开头的不变
	 * Time：开头的不变
	 * 模式头的截取到模式尾
	 * 其他跳过
	 */
	
	

}
