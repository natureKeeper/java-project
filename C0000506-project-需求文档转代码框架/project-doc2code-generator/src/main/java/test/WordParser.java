package test;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import jp.ne.so_net.ga2.no_ji.jcom.IDispatch;
import jp.ne.so_net.ga2.no_ji.jcom.JComException;
import jp.ne.so_net.ga2.no_ji.jcom.ReleaseManager;

public class WordParser {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
	// TODO Auto-generated method stub
		File f = new File("D:\\tmp\\test.doc");
		MSOfficeEnvironment.init();

		WordDoc msWord = null;

		try {
			msWord = new WordDoc(f);
			List<WordTable> tables = msWord.getTables();

			for (WordTable table : tables) {
				WordTableRow r1 = table.getRow(0);
				WordTableCell c1 = r1.getCell(0);
				String s1 = c1.getCellText();
				
				WordTableRow r2 = table.getRow(1);
				WordTableCell c2 = r2.getCell(0);
				String s2 = c2.getCellText();
				
				System.out.println(s1 + "\t" + s2);
				
			}
		} catch (Exception e) {

		} finally {
			try {
				if (null != msWord) {
					msWord.quit();
				}
			} catch (JComException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			MSOfficeEnvironment.release();
		}
	
	}
	
}

/**
 * 封装jcom的
 * 
 * @author wusuirong
 * 
 */
class MSOfficeEnvironment {
	static ReleaseManager rm = null;

	static void init() {
		rm = new ReleaseManager();
	}

	static ReleaseManager getReleaseManager() {
		return rm;
	}

	static void release() {
		rm.release();
	}
}

/**
 * 封装jcom的word对象
 * 
 * @author wusuirong
 * 
 */
class WordDoc {
	IDispatch doc;
	IDispatch wdApp;

	List<WordTable> tables = new ArrayList<WordTable>();

	public WordDoc(File file) throws JComException {
		this(file.getAbsolutePath());
		if (!file.exists()) {
			throw new IllegalArgumentException("" + file.getAbsolutePath() + "不存在");
		}
	}

	public WordDoc(String filePath) throws JComException {

		wdApp = new IDispatch(MSOfficeEnvironment.getReleaseManager(), "Word.Application");
		wdApp.put("Visible", new Boolean(false));

		IDispatch docs = (IDispatch) wdApp.get("Documents");
		doc = (IDispatch) docs.method("Open", new Object[] { filePath });

		IDispatch msTables = (IDispatch) doc.get("Tables");
		int tableAmount = ((Integer) msTables.get("Count")).intValue();

		for (int tabIdx = 1; tabIdx <= tableAmount; tabIdx++) {
			IDispatch msTable = (IDispatch) msTables.method("item", new Object[] { new Integer(tabIdx) });
			WordTable table = new WordTable();
			table.setTable(msTable);
			tables.add(table);
		}
	}

	/**
	 * 返回word文档中的所有表格
	 * 
	 * @return
	 * @throws JComException
	 */
	public List<WordTable> getTables() throws JComException {
		return tables;
	}

	public void quit() throws JComException {
		wdApp.method("Quit", null);
	}
}

/**
 * 封装jcom的word表格对象
 * 
 * @author wusuirong
 * 
 */
class WordTable {
	IDispatch table;
	List<WordTableRow> rows = new ArrayList<WordTableRow>();

	public void setTable(IDispatch table) throws JComException {
		this.table = table;

		IDispatch msRows = ((IDispatch) table.get("rows"));
		int rowAmount = ((Integer) msRows.get("Count")).intValue();

		for (int rowIdx = 1; rowIdx <= rowAmount; rowIdx++) {
			IDispatch msRow = (IDispatch) msRows.method("item", new Object[] { new Integer(rowIdx) });
			WordTableRow row = new WordTableRow();
			row.setRow(msRow);
			rows.add(row);
		}
	}

	public List<WordTableRow> getRows() {
		return rows;
	}

	public WordTableRow getRow(int i) {
		return rows.get(i);
	}

	public int getRowCount() {
		return rows.size();
	}
}

/**
 * 封装jcom的表格行对象
 * 
 * @author wusuirong
 * 
 */
class WordTableRow {
	IDispatch row;

	List<WordTableCell> cells = new ArrayList<WordTableCell>();

	public void setRow(IDispatch row) throws JComException {
		this.row = row;

		IDispatch msCells = (IDispatch) row.get("Cells");
		int cellAmount = ((Integer) msCells.get("Count")).intValue();
		for (int cellIdx = 1; cellIdx <= cellAmount; cellIdx++) {
			IDispatch msCell = (IDispatch) msCells.method("item", new Object[] { new Integer(cellIdx) });
			WordTableCell cell = new WordTableCell();
			cell.setCell(msCell);
			cells.add(cell);
		}

	}

	public List<WordTableCell> getCells() {
		return cells;
	}

	public WordTableCell getCell(int i) {
		return cells.get(i);
	}

	public int getCellCount() {
		return cells.size();
	}
}

/**
 * 封装jcom的表格单元对象
 * 
 * @author wusuirong
 * 
 */
class WordTableCell {
	IDispatch cell;

	public void setCell(IDispatch cell) {
		this.cell = cell;
	}

	public String getCellText() {
		try {
			String text = (String) ((IDispatch) cell.get("Range")).get("Text");
			if (text == null) {
				return "";
			}

			if (text.trim().equals("")) {
				return "";
			}

			return text.trim().replaceAll(" ", "");
		} catch (JComException e) {
			return "";
		}
	}
}