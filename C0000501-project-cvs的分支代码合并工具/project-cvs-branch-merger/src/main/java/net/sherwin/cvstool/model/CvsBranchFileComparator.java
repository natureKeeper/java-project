package net.sherwin.cvstool.model;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import net.sherwin.cvstool.model.data.CvsEntry;
import net.sherwin.cvstool.model.data.DirPair;
import net.sherwin.cvstool.model.data.FileInfo;
import net.sherwin.cvstool.model.data.FileInfoPair;
import net.sherwin.cvstool.model.util.Config;
import net.sherwin.cvstool.model.util.CvsControlFileHelper;
import net.sherwin.cvstool.model.util.DiffFileResultCollector;
import net.sherwin.cvstool.model.util.FilePatternMatcher;

public class CvsBranchFileComparator {
	
	/**
	 * 比对2个目录中本地有改动的文件
	 * @param dir1
	 * @param dir2
	 * @return
	 * @throws Exception 
	 */
	public List<FileInfoPair> compareLocalModifiedFileRecursively(File dir1, File dir2) throws Exception {
		DiffFileResultCollector collector = new DiffFileResultCollector();
		
		if (dir1.isDirectory() && dir2.isDirectory()) {
			Stack<DirPair> dirPairs = new Stack<DirPair>();
			
			FileInfo fi1 = new FileInfo(dir1.getAbsolutePath(), false, true, true);
			FileInfo fi2 = new FileInfo(dir2.getAbsolutePath(), false, true, true);
			DirPair dirPair = new DirPair(fi1, fi2);
			
			dirPairs.add(dirPair);
			compareTwoDirDiffs(dirPairs, collector);
		}

		return collector.getResults();
	}
	
	/**
	 * 比对文件夹pair dirPairs中的差异，把结果放在results
	 * @param dirPairs
	 * @param results
	 * @return
	 * @throws Exception 
	 */
	void compareTwoDirDiffs(Stack<DirPair> dirPairs, DiffFileResultCollector collector) throws Exception {
		if (!dirPairs.isEmpty()) {
			DirPair dirPair = dirPairs.pop();
			List<FileInfoPair> filePairs = compareTwoDirDiffFiles(dirPair);
			collector.collect(filePairs);
			
			Stack<DirPair> subdirPairs = getSameSubDirsByName(dirPair, collector);
			dirPairs.addAll(subdirPairs);
			
			compareTwoDirDiffs(dirPairs, collector);
		}
	}
	
	/**
	 * 比较文件夹pair中的差异文件，返回有差异的文件对
	 * 这里的差异是指以下情况
	 * 1 两边都存在都是在cvs上的文件，某方修改过
	 * 2 一方存在，是新增的文件，还没提交
	 * 3 一方存在，是cvs上的文件，本地修改过
	 * @param pair
	 * @return
	 * @throws Exception 
	 */
	List<FileInfoPair> compareTwoDirDiffFiles(DirPair pair) throws Exception {
		File dir1 = pair.dir1;
		File dir2 = pair.dir2;
		
		List<FileInfoPair> pairs = new ArrayList<FileInfoPair>();

		Map<String, FileInfo> files1 = listFilesInDir(dir1);
		Map<String, FileInfo> files2 = listFilesInDir(dir2);
		
		Iterator<Map.Entry<String, FileInfo>> it1 = files1.entrySet().iterator();
		while (it1.hasNext()) {
			Map.Entry<String, FileInfo> entry1 = it1.next();
			String filename = entry1.getKey();
			FileInfo fi1 = entry1.getValue();			
			
			FileInfo fi2 = findMatchFileInfoByName(filename, files2);
			if (null != fi2) {
				files2.remove(filename);
				if (isDiffFileInfo(fi1, fi2)) {
					pairs.add(new FileInfoPair(fi1, fi2));
				}
			} else {
				if (!fi1.isCvsFile
						|| (fi1.isCvsFile && fi1.localModified)) {
					pairs.add(new FileInfoPair(fi1, null));
				}				
			}
		}
		
		Iterator<Map.Entry<String, FileInfo>> it2 = files2.entrySet().iterator();
		while (it2.hasNext()) {
			FileInfo fi2 = it2.next().getValue();
			if (!fi2.isCvsFile
					|| (fi2.isCvsFile && fi2.localModified)) {
				pairs.add(new FileInfoPair(null, fi2));
			}			
		}
		return pairs;
	}
	
	/**
	 * 判断2个file的cvs信息是否有差异
	 * @param fi1
	 * @param fi2
	 * @return
	 */
	boolean isDiffFileInfo(FileInfo fi1, FileInfo fi2) {
		if (fi1.isCvsFile && fi2.isCvsFile
				&& !fi1.localModified && !fi2.localModified) {
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * 列出文件夹下的文件的CVS相关信息
	 * @param dir
	 * @return
	 * @throws Exception 
	 */
	Map<String, FileInfo> listFilesInDir(File dir) throws Exception {
		if (null != dir) {
			FileFilter ff = new FileFilter() {
				public boolean accept(File pathname) {
					if (pathname.isFile()
							&& !FilePatternMatcher.match(pathname.getAbsolutePath())) {
						return true;
					} else {
						return false;
					}				
				}			
			};
			File[] files = dir.listFiles(ff);
			return analyseFilesCvsPropInDir(dir, files);
		} else {
			return new HashMap<String, FileInfo>();
		}
	}
	
	/**
	 * 分析目录dir下的指定一批file或目录的cvs属性
	 * @param dir
	 * @param filesInDir
	 * @return
	 * @throws Exception
	 */
	Map<String, FileInfo> analyseFilesCvsPropInDir(File dir, File[] filesInDir) throws Exception {
		Map<String, FileInfo> result = new HashMap<String, FileInfo>();
		if (null != filesInDir
				&& 0 < filesInDir.length) {
			Map<String, CvsEntry> entries = getCvsEntriesOfDir(dir);
			for (File f : filesInDir) {
				FileInfo fi = analyseFile(f, entries);
				result.put(f.getName(), fi);
			}
		}
		return result;
	}
	
	/**
	 * 列出文件夹下的子文件夹信息
	 * @param dir
	 * @return
	 */
	Map<String, FileInfo> listSubDirsInDir(File dir) {
		Map<String, FileInfo> results = new HashMap<String, FileInfo>();
		if (null != dir) {
			FileFilter ff = new FileFilter() {
				public boolean accept(File pathname) {
					if (pathname.isDirectory()
							&& !"CVS".equals(pathname.getName())
							&& !FilePatternMatcher.match(pathname.getAbsolutePath())) {
						return true;
					} else {
						return false;
					}
				}
			};
			File[] files = dir.listFiles(ff);
			
			if (null != files
					&& 0 < files.length) {
				for (File f : files) {
					FileInfo fi = new FileInfo(f.getAbsolutePath(), false, false, false);
					results.put(f.getName(), fi);
				}
			}			
		}
		return results;
	}
	
	/**
	 * 比较dirPair中两个目录的所有子目录，返回有相同名字的子目录列表，对于不匹配的子目录，递归把里面的文件添加到差异列表中
	 * @param dirPair
	 * @param collector
	 * @return
	 * @throws Exception 
	 */
	Stack<DirPair> getSameSubDirsByName(DirPair dirPair, DiffFileResultCollector collector) throws Exception {
		Stack<DirPair> dirPairs = new Stack<DirPair>();
		File dir1 = dirPair.dir1;
		File dir2 = dirPair.dir2;
		
		Map<String, FileInfo> subdirs1 = listSubDirsInDir(dir1);
		Map<String, FileInfo> subdirs2 = listSubDirsInDir(dir2);
		
		Iterator<Map.Entry<String, FileInfo>> it1 = subdirs1.entrySet().iterator();
		while (it1.hasNext()) {
			Map.Entry<String, FileInfo> entry1 = it1.next();
			
			String dirname1 = entry1.getKey();
			FileInfo subdir1 = entry1.getValue();
			
			FileInfo subdir2 = getDirInfoByName(dirname1, subdirs2);
			if (null != subdir2) {
				subdirs2.remove(dirname1);
				dirPairs.add(new DirPair(subdir1, subdir2));
			} else {
				recursiveCollectFiles(new File(subdir1.fullpathName), true, collector);
			}
		}
		
		Iterator<Map.Entry<String, FileInfo>> it2 = subdirs2.entrySet().iterator();
		while (it2.hasNext()) {
			FileInfo subdir2 = it2.next().getValue();
			recursiveCollectFiles(new File(subdir2.fullpathName), false, collector);
		}
		
		return dirPairs;
	}
	
	/**
	 * 根据名称在dirs里找匹配目录
	 * @param dirname
	 * @param dirs
	 * @return
	 */
	FileInfo getDirInfoByName(String dirname, Map<String, FileInfo> dirs) {
		if (dirs.containsKey(dirname)) {
			return dirs.get(dirname);
		} else {
			return null;
		}
	}
	
	/**
	 * 递归收集目录下本地有改动的文件
	 * @param dir
	 * @param saveInLeft
	 * @param collector
	 * @throws Exception 
	 */
	void recursiveCollectFiles(File dir, boolean saveToLeft, DiffFileResultCollector collector) throws Exception {
		FileFilter ff = new FileFilter() {
			public boolean accept(File pathname) {
				if (pathname.isDirectory()
						&& "CVS".equals(pathname.getName())) {
					return false;
				} else {
					return true;
				}
			}
		};
		File[] files = dir.listFiles(ff);
		
		Map<String, FileInfo> fileInfos = analyseFilesCvsPropInDir(dir, files);
		
		if (null != fileInfos) {
			for (FileInfo fi : fileInfos.values()) {
				if (fi.isFile) {
					if (!fi.isCvsFile || fi.localModified) {
						if (saveToLeft) {
							collector.collect(new FileInfoPair(fi, null));
						} else {
							collector.collect(new FileInfoPair(null, fi));
						}
					}				
				} else {
					recursiveCollectFiles(new File(fi.fullpathName), saveToLeft, collector);
				}				
			}
		}
	}
	
	/**
	 * 根据FileInfo的文件名在map中找匹配的entry
	 * @param fi
	 * @param fis
	 * @return
	 */
	FileInfo findMatchFileInfoByName(String filename, Map<String, FileInfo> fis) {
		Iterator<String> it = fis.keySet().iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (key.equals(filename)) {
				return fis.get(key);
			}
		}
		return null;
	}
	
	/**
	 * 返回目标目录中的CVS控制目录
	 * @param dir
	 * @return
	 */
	protected File getCvsCtlDir(File dir) {
		FileFilter ff = new FileFilter() {
			public boolean accept(File pathname) {
				if (pathname.isDirectory()
						&& "CVS".equals(pathname.getName())) {
					return true;
				} else {
					return false;
				}				
			}			
		};
		File[] files = dir.listFiles(ff);
		if (null != files
				&& 0 < files.length) {
			return files[0];
		} else {
			return null;
		}
	}
	
	File getCvsEntryFile(File cvsCtlDir) {
		FileFilter ff = new FileFilter() {
			public boolean accept(File pathname) {
				if (pathname.isFile()
						&& "Entries".equals(pathname.getName())) {
					return true;
				} else {
					return false;
				}				
			}			
		};
		File[] files = cvsCtlDir.listFiles(ff);
		if (null != files
				&& 0 < files.length) {
			return files[0];
		} else {
			return null;
		}
	}
	
	Map<String, CvsEntry> getCvsEntries(File cvsEntryFile) throws Exception {
		Map<String, CvsEntry> entries = new HashMap<String, CvsEntry>();
		
		FileInputStream fis = new FileInputStream(cvsEntryFile);
		InputStreamReader isr = new InputStreamReader(fis, Config.getConfigValue(Config.CVS_ENTRIES_FILE_ENCODING));
		BufferedReader br = new BufferedReader(isr);
		String line = null;
		while (null != (line = br.readLine())) {
			String[] tokens = line.split("/",6);
			if (1 < tokens.length) {
				CvsEntry entry = new CvsEntry();
				
				if ("D".equals(tokens[0])) {
					entry.isDirectory = true;
				} else {
					entry.isDirectory = false;
				}
				entry.fileName = tokens[1];
				
				entry.version = tokens[2];
				entry.date = tokens[3];
				entry.type = tokens[4];
				
				entry.branch = tokens[5];
				
				entries.put(entry.fileName, entry);
			}
		}
		
		return entries;
	}
	
	/**
	 * 根据File分析属性得到对应的FileInfo
	 * @param file
	 * @param entries
	 * @return
	 */
	FileInfo analyseFile(File file, Map<String, CvsEntry> entries) {
		FileInfo fi = new FileInfo(file.getAbsolutePath(), file.isFile(), false, true);
		String fname = file.getName();
		if (null != entries
				&& entries.containsKey(fname)) {
			CvsEntry entry = entries.get(fname);
			fi.isCvsFile = true;
			
			if (file.isFile() && CvsControlFileHelper.isFileModifiedLocally(file, entry)) {
				fi.localModified = true;
			} else {
				fi.localModified = false;
			}
		}
		
		return fi;
	}
	
	/**
	 * 取出当前目录的CVS目录中的Entries文件中的信息
	 * @param dir
	 * @return
	 * @throws Exception 
	 */
	Map<String, CvsEntry> getCvsEntriesOfDir(File dir) throws Exception {
		Map<String, CvsEntry> result = null;
		
		File cvsCtlDir = getCvsCtlDir(dir);
		if (null != cvsCtlDir) {
			File cvsEntryFile = getCvsEntryFile(cvsCtlDir);
			if (null != cvsEntryFile) {
				result = getCvsEntries(cvsEntryFile);
			}
		}
		return result;
	}

}
