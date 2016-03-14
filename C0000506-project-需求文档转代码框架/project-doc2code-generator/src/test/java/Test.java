import java.io.File;

import org.apache.commons.lang.math.NumberUtils;

import common.util.FileUtil;
import common.util.StringUtil;


public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
	// TODO Auto-generated method stub
		String string = FileUtil.readFileAsString(new File("d:/123.txt"), "gbk");
		String[] lines = StringUtil.splitByLinebreak(string);
		for (int i=0; i<lines.length; i++) {
			String line = lines[i];
			line = line.substring(1);
			if (NumberUtils.isDigits(line)
					&& !line.contains(":")) {
				i++;
				System.out.println(lines[i]);
			}
			
		}
	}
}
