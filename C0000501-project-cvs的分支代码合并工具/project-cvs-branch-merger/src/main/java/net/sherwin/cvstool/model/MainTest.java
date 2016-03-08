package net.sherwin.cvstool.model;

import java.io.File;
import java.util.List;

import net.sherwin.cvstool.model.data.DirPair;
import net.sherwin.cvstool.model.data.FileInfoPair;
import net.sherwin.cvstool.model.util.DirPairs4CompareKeeper;

public class MainTest {
	public static void main(String[] args) throws Exception {
		long start = System.currentTimeMillis();
		DirPairs4CompareKeeper keeper = DirPairs4CompareKeeper.getInstance();
		List<DirPair> dirpairs = keeper.getPairs();
		
		CvsBranchFileComparator comparator = new CvsBranchFileComparator();
		for (DirPair dirpair : dirpairs) {
			List<FileInfoPair> pairs = comparator.compareLocalModifiedFileRecursively(dirpair.dir1, dirpair.dir2);
			for (FileInfoPair pair : pairs) {
				System.out.println("############### begin ########################");
				if (null != pair.fileInfo1) {
					System.out.println(pair.fileInfo1.fullpathName);
				} else {
					System.out.println("-----------------------");
				}
				
				if (null != pair.fileInfo2) {
					System.out.println(pair.fileInfo2.fullpathName);
				} else {
					System.out.println("-----------------------");
				}
				System.out.println("############### end ########################");			
				System.out.println();
				
				if (null != pair.fileInfo1
						&& null != pair.fileInfo2) {
					String command = new String("D:\\opt\\WinMerge-2.12.4-exe\\WinMergeU.exe" +
										" /e /u " +
										pair.fileInfo1.fullpathName + " " +
										pair.fileInfo2.fullpathName);

					Process process= Runtime.getRuntime().exec(command);  
					int exitcode = process.waitFor(); 
				}
			}
		}
		long end = System.currentTimeMillis();
		System.out.println((end - start)/1000);
	}
}
