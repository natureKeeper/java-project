package net.sherwin.cvstool.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import net.sherwin.common.io.FileUtil;
import net.sherwin.cvstool.model.data.DirPair;
import net.sherwin.cvstool.model.data.FileInfoPair;
import net.sherwin.cvstool.model.util.DirPairs4CompareKeeper;
import net.sherwin.cvstool.model.util.MergeFileHelper;

public class ModelFacade {
	
	
	/**
	 * 取得要比对的目录pair
	 * @return
	 */
	public List<DirPair> getComparingDirPairs() {
		DirPairs4CompareKeeper keeper = DirPairs4CompareKeeper.getInstance();
		return keeper.getPairs();
	}
	
	/**
	 * 开始比对
	 * @return
	 * @throws Exception 
	 */
	public List<FileInfoPair> compareLocalModifiedFileRecursively(List<DirPair> dirpairs) throws Exception {
		List<FileInfoPair> results = new ArrayList<FileInfoPair>();
		
		CvsBranchFileComparator comparator = new CvsBranchFileComparator();
		for (DirPair dirpair : dirpairs) {
			List<FileInfoPair> pairs = comparator.compareLocalModifiedFileRecursively(dirpair.dir1, dirpair.dir2);
			results.addAll(pairs);
		}
		return results;
	}
	
	/**
	 * 调用合并功能
	 * @param file1
	 * @param lock1
	 * @param file2
	 * @param lock2
	 * @param sync
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public void mergeFiles(String file1, boolean lock1, String file2, boolean lock2, boolean sync) throws IOException, InterruptedException {
		MergeFileHelper.mergeFiles(file1, lock1, file2, lock2, sync);
	}
	
	/**
	 * 复制一个对等的file
	 * 并返回复制后的文件的全路径
	 * @param source
	 * @return
	 */
	public String copyReciprocalFile(String source) {
		String dest = null;
		List<DirPair> pairs = DirPairs4CompareKeeper.getInstance().getPairs();
		for (DirPair pair : pairs) {
			String pathPreffix = pair.dir1.getAbsolutePath();
			if (source.contains(pathPreffix)) {
				String suffix = source.substring(pathPreffix.length());
				dest = pair.dir2.getAbsolutePath() + suffix;
				break;
			}
			
			pathPreffix = pair.dir2.getAbsolutePath();
			if (source.contains(pathPreffix)) {
				String suffix = source.substring(pathPreffix.length());
				dest = pair.dir1.getAbsolutePath() + suffix;
				break;
			}
		}
		
		FileUtil.copyFile(source, dest);
		return dest;
	}
}
