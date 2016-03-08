package net.sherwin.cvstool.model.util;

import java.util.ArrayList;
import java.util.List;

import net.sherwin.cvstool.model.data.FileInfoPair;

public class DiffFileResultCollector {
	List<FileInfoPair> results = new ArrayList<FileInfoPair>();
	public void collect(FileInfoPair pair) {
		results.add(pair);
	}
	public void collect(List<FileInfoPair> pairs) {
		results.addAll(pairs);
	}
	public List<FileInfoPair> getResults() {
		return results;
	}
}