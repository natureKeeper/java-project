package net.sherwin.cvstool.model.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import net.sherwin.cvstool.model.data.DirPair;

public class DirPairs4CompareKeeper {
	
	private static final transient Log log = LogFactory.getLog(DirPairs4CompareKeeper.class);

	
	static private DirPairs4CompareKeeper instance = new DirPairs4CompareKeeper();
	
	static final String DIRPAIRS_FOR_COMPARE_FILE = "dirPairsForCompare.txt";
	
	List<DirPair> dirPairs;
	
	private DirPairs4CompareKeeper() {
		dirPairs = new ArrayList<DirPair>();
		load();
	}
	
	static public DirPairs4CompareKeeper getInstance() {
		return instance;
	}
	
	public List<DirPair> getPairs() {
		return dirPairs;
	}
	
	public void reload() {
		dirPairs.clear();
		load();
	}
	
	private void load() {
		try {
			FileReader fr = new FileReader(new File(DIRPAIRS_FOR_COMPARE_FILE));
			BufferedReader br = new BufferedReader(fr);
			String line = null;
			DirPair pair = null;
			while (null != (line = br.readLine())) {
				if (0 < line.length()
						&& !line.startsWith("#")) {
					String[] twoDirs = line.split("\\|");
					if (1 < twoDirs.length) {
						pair = new DirPair(twoDirs[0], twoDirs[1]);
						dirPairs.add(pair);
					}
				}
			}
		} catch (Exception e) {
			log.error("", e);
		}
	}
}
