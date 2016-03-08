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


public class CvsMailInfoFormatter {
	
	String cvsPath = "/";
	String encoding = "GB2312";
	
	String outputPath;
	String backupPath;
	
	/**
	 * 扫描读入的每行，如果符合正则式1则原样输出，符合补丁文件路径规则则截取输出，否则忽略
	 * @param input
	 * @param output
	 * @throws IOException
	 */
	void convertFileContent(BufferedReader input, BufferedWriter output) throws IOException {
		
		String line = null;
		
		String branch = "head";
		StringBuffer desc = new StringBuffer("#description:\r\n");
		
		Boolean writeVersion = Boolean.FALSE;
		
		while(null != (line = input.readLine())) {
			if (line.indexOf("Changes by:") >= 0) {//owner
				writeOwner(line, output);
				
			} else if (line.indexOf("Log Message:") >= 0) {//description				
				writeDesc(line, desc, input, output);
				
			} else if (line.indexOf("[") >= 0 && line.endsWith("]")) {//file
				writeVersion = writeFileList(line, branch, writeVersion, input, output);
			}
		}
	}
	
	void writeOwner(String line, BufferedWriter output) throws IOException {
		int startIdx = line.indexOf(":");
		int endIdx = line.indexOf("(");
		String name = line.substring(startIdx+1,endIdx).trim();
		
		output.write("#owner:" + name);
		output.newLine();
	}
	
	void writeDesc(String line, StringBuffer desc, BufferedReader input, BufferedWriter output) throws IOException {
		while(null != (line = input.readLine())) {
			if (line.indexOf("Affected files") >= 0) {
				break;
			}
			desc.append("#" + line + "\r\n");
		}

		output.write(desc.toString());
	}
	
	Boolean writeFileList(String line, String branch, Boolean writeVersion, BufferedReader input, BufferedWriter output) throws IOException {
		
		int startIdx = line.indexOf("[");
		int endIdx = line.indexOf("]");
		
		String prefix = line.substring(startIdx+1,endIdx).trim();
		
		while(null != (line = input.readLine())) {
			line = line.replace("> ", "").trim();
			
			if (line.indexOf("--------") >= 0) {
				break;
			}
			
			int counter = 0;
			
			String[] arr = line.split(" ");
			String fileFullName = null, version = null;
			for(int i=0; i<arr.length; i++) {
				if ("".equals(arr[i])) {
					continue;
				}
				switch (counter) {
				case 0:
					fileFullName = prefix + "/" + arr[i];
					counter++;
					break;
				case 1://ignore
					counter++;
					break;
				case 2:
					version = arr[i];
					if ("NONE".equals(version)) {
						version = "delete";
					}
					output.newLine();
					counter++;
					break;
				case 3:
					branch = arr[i];						
					counter++;
					break;
				}
			}
			if (!writeVersion) {				
				output.write("Branch:" + branch);
				output.newLine();
				output.newLine();
				writeVersion = Boolean.TRUE;
			}
			
			output.write(fileFullName + "\t" + version);
		}
		
		return writeVersion;
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
		CvsMailInfoFormatter obj = new CvsMailInfoFormatter();
		
		FileInputStream fis = new FileInputStream(new File("formatter.properties"));
		Properties prop = new Properties();
		prop.load(fis);
		obj.encoding = prop.getProperty("encoding", "GB2312");
//		obj.cvsPath = prop.getProperty("cvsPath","/");
		obj.outputPath = prop.getProperty("outputPath","c:/output");
		obj.backupPath = prop.getProperty("backupPath","c:/backup");
		String patchRoot = prop.getProperty("filePath", "c:/");
		
		System.out.println("###########################################");
		System.out.println("encoding: " + obj.encoding);
//		System.out.println("cvsPath: " + obj.cvsPath);
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
}
