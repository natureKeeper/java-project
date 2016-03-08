package net.sherwin.cvstool.model.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class FilePatternMatcher {
	
	private static final transient Log log = LogFactory.getLog(FilePatternMatcher.class);
	
	static Set<String> patterns;
	
	static final String EXCLUDE_PATTERNS_FILE = "excludePatterns.txt";
	
	static {
		patterns = new HashSet<String>();

		try {
			FileReader fr = new FileReader(new File(EXCLUDE_PATTERNS_FILE));
			BufferedReader br = new BufferedReader(fr);
			String line = null;
			
			while (null != (line = br.readLine())) {
				if (0 < line.length()
						&& !line.startsWith("#")) {
					patterns.add(line);
				}
			}
		} catch (Exception e) {
			log.error("", e);
		}
	}
	
	public static boolean match(String fileFullPath) {
		return patterns.contains(fileFullPath);
	}
}
