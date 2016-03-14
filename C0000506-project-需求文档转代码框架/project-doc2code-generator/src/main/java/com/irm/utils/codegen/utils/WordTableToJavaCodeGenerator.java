package com.irm.utils.codegen.utils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.Vector;

import jp.ne.so_net.ga2.no_ji.jcom.IDispatch;
import jp.ne.so_net.ga2.no_ji.jcom.JComException;
import jp.ne.so_net.ga2.no_ji.jcom.ReleaseManager;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * 培云提供的读取word的例子
 * @author Administrator
 *
 */
public class WordTableToJavaCodeGenerator
{
    private static final String DOC_FILE = "d:\\doc\\test.docx";
    private static final String SCRIPT_FILE = "d:\\doc\\test.sql";
    private static final boolean createTable = true;

    public WordTableToJavaCodeGenerator()
    {
    }
    private static transient Log log = LogFactory.getLog(WordTableToJavaCodeGenerator.class);
    public static void main(String[] args) throws Exception
    {
        Date startDate = Calendar.getInstance().getTime();
        StartCreate();
        Date endDate = Calendar.getInstance().getTime();
        long cost = (endDate.getTime()-startDate.getTime())/1000;
        System.out.println("cost(s):" +cost);
    }
    
    
    


    public static void StartCreate()
    {
    	
    	MSOfficeEnvironment.init();

        try
        {
            BufferedWriter writer = new BufferedWriter(new FileWriter(SCRIPT_FILE));
            BufferedWriter delWriter = new BufferedWriter(new FileWriter(SCRIPT_FILE+"_delete"));
            
            WordDoc word = new WordDoc(DOC_FILE);

            List<WordTable> tables = word.getTables();

            for (WordTable table : tables) {
                String tablename = getTableName(table);
                if (tablename == null)
                    continue;

                if (tablename.toUpperCase().startsWith("C_")
                    ||tablename.toUpperCase().startsWith("E_")
                    ||tablename.toUpperCase().startsWith("TM_")
                    ||tablename.toUpperCase().startsWith("BM_"))
                    createScript(table,writer,delWriter);
            }

            writer.flush();
            delWriter.flush();
            writer.close();
            delWriter.close();
            
            word.quit();
        }
        catch (Exception e)
        {
          log.error(e,e);
        }
        finally
        {
        	MSOfficeEnvironment.release();
        }
    }

    private static String randomSubstr(String str_, int length)
    {
        String str = str_;
        if (str == null || str.length() <= length)
            return str;

        Random random = new Random();

        while (str.length() > length)
        {
            int i = random.nextInt(str.length());
            str = str.substring(0, i) + str.substring(i + 1);
        }

        return str;
    }


    private static String getOracleName(String prefix_, String tableName_, String columnName_)
    {
        String str1 = tableName_;
        if (!prefix_.equalsIgnoreCase("SEQ_"))
            str1 = tableName_.replaceAll("_", "");

        if (columnName_ == null)
        {
            if (prefix_.length() + str1.length() <= 30)
                return prefix_ + str1;
            else
                return (prefix_ + str1).substring(0, 30);
        }

        String str2 = null;
        if (columnName_.indexOf("_") >= 1)
            str2 = columnName_.substring(0, columnName_.indexOf("_"));
        else
             str2 = columnName_;


        if (prefix_.length() + str1.length() + str2.length() >= 30)
        {
            if (str2.length() >= 12)
                str2 = randomSubstr(str2, 12);
        }

        if (prefix_.length() + str1.length() + str2.length() >= 30)
        {
            if (str1.length() >= (29 - prefix_.length() - str2.length()))
                str1 = randomSubstr(str1, 29 - prefix_.length() - str2.length());
        }

        return prefix_ + str1 + "2" + str2;
    }

    private static String getCellText(WordTable table,int rowIdx,int colIdx) throws Exception
    {
    	WordTableRow row = table.getRow(rowIdx);
    	WordTableCell cell = row.getCell(colIdx);
    	String text = cell.getCellText();
        if (text == null)
            return null;
        if (text.trim().equals(""))
            return null;
        return text.trim().replaceAll(" ","");
    }

    private static String getCellText(WordTableRow row, int colIdx) throws Exception
    {
    	List<WordTableCell> cells = row.getCells();
    	WordTableCell cell = cells.get(colIdx);
        String text = cell.getCellText();
        if (text == null)
            return null;
        if (text.trim().equals(""))
            return null;
        return text.trim();
    }

    private static String getSpace(int length)
    {
        String str = " ";
        for (int i = 1; i < length; i++)
        {
            str += " ";
        }

        return str;
    }

    private static boolean isOracleColumn(WordTableRow row) throws Exception
    {
        int columnAmount = row.getCellCount();

        int rowOffset = 0;
        if (columnAmount == 8)
            rowOffset = 0;
        else if (columnAmount == 9)
            rowOffset = 1;
        else
            return false;

        String ColumnName = getCellText(row, rowOffset + 3) == null ? getCellText(row, rowOffset + 2) : getCellText(row, rowOffset + 3);
        if (ColumnName == null || ColumnName.trim().equals(""))
            return false;

        return true;
    }

    private static String getTableName(WordTable table)
    {
        try
        {
            return getCellText(table, 2, 1).toUpperCase();
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    private static void createScript(WordTable table,BufferedWriter writer,BufferedWriter delWriter) throws Exception
    {
    	List<WordTableRow> rows = table.getRows();
        int rowAmount = rows.size();
        
        

        String tableName = getCellText(table,2,1);
        String tableComment = getCellText(table,0,1);

        Vector commentscripts = new Vector();
        Vector keyScripts = new Vector();
        Vector indexScripts = new Vector();
        if (createTable)
        {
            writer.append("create table " + tableName);
            writer.newLine();
            writer.append("(");
            writer.newLine();
            commentscripts.addElement("comment on table " + tableName + "  is '" + tableComment + "';");
        }

        for (int i = 4; i < rowAmount-1; i++)
        {
        	WordTableRow row = rows.get(i);
            int columnAmount = row.getCellCount();

            int rowOffset = 0;
            if (columnAmount == 8)
                rowOffset = 0;
            else if (columnAmount == 9)
                rowOffset = 1;
            else
                continue;

            String ColumnName = getCellText(row,rowOffset+2)==null? getCellText(row,rowOffset+1):getCellText(row,rowOffset+2);
            if (ColumnName == null || ColumnName.trim().equals(""))
                continue;

            String chineseName = getCellText(row,rowOffset);
            String dateType = getCellText(row,rowOffset+3);
            String isNotNull = getCellText(row,rowOffset+5);
            String referenceTable =  getCellText(row,rowOffset+7);

            boolean isFk = false;
             if (dateType.toUpperCase().equals("{ID}"))
                 dateType = "number(9)";
             else if (dateType.toUpperCase().equals("{MEMO}"))
                 dateType = "VARCHAR2(255)";
             else if (dateType.toUpperCase().equals("{VERSION}"))
                 dateType = "number(9)";
             else if (dateType.toUpperCase().equals("{OPERATOR}"))
                 dateType = "VARCHAR2(255)";
             else if (dateType.toUpperCase().equals("{DICTIONARY}"))
                 dateType = "number(4)";
             else if (dateType.toUpperCase().equals("{BOOLEAN}"))
                 dateType = "number(4)";
             else if (dateType.toUpperCase().equals("{FK}"))
             {
                 dateType = "number(9)";
                 isFk = true;
             }

             if (ColumnName.equalsIgnoreCase("EXTENSIONID"))
             {
                 referenceTable = tableName.substring(0, tableName.indexOf("_", 4)).toUpperCase();
                 referenceTable = "C"+referenceTable.substring(1);
             }

             if (isFk && referenceTable == null)
             {
                 if (ColumnName.toUpperCase().equals("ENTITYTYPE_ID"))
                     referenceTable = "MM_ENTITYTYPE";
                 else if (ColumnName.toUpperCase().endsWith("PROVINCE_ID")
                          || ColumnName.toUpperCase().endsWith("PREFECTURE_ID")
                          || ColumnName.toUpperCase().endsWith("COUNTY_ID")
                          || ColumnName.toUpperCase().endsWith("TOWNSHIP_ID"))
                     referenceTable = "C_REGION";
                 else if (ColumnName.toUpperCase().endsWith("STRONGHOLD_ID")
                          || ColumnName.toUpperCase().endsWith("ROOM_ID")
                          || ColumnName.toUpperCase().endsWith("SITE_ID"))
                     referenceTable = "C_LOCATION";
                 else if (ColumnName.toUpperCase().endsWith("DEVICE_ID"))
                     referenceTable = "C_DEVICE";
                 else if (ColumnName.toUpperCase().endsWith("NODE_ID"))
                     referenceTable = "C_NODE";
                 else if (ColumnName.toUpperCase().equals("EQUIPMENTMODEL_ID"))
                     referenceTable = "BM_EQUIPMENTMODEL";
                 else if (ColumnName.toUpperCase().equals("SPECIALTYTYPE_ID"))
                     referenceTable = "BM_SPECIALTYTYPE";
                 else if (ColumnName.toUpperCase().endsWith("JOINT_ID"))
                     referenceTable = "C_JOINT";
                 else if (ColumnName.toUpperCase().equals("NETWORKLAYER_ID"))
                     referenceTable = "BM_NETWORKLAYER";
                 else if (ColumnName.toUpperCase().equals("EMS_ID"))
                     referenceTable = "C_EMS";
                 else if (ColumnName.toUpperCase().equals("CELL_ID"))
                     referenceTable = "C_CELL";
                 else if (ColumnName.toUpperCase().equals("EQUIPMENTVENDOR_ID"))
                     referenceTable = "BM_EQUIPMENTVENDOR";
                 else if (ColumnName.toUpperCase().equals("INVENTORYIMPORTINGTEMPLATE_ID"))
                     isFk = false;
                 else if (ColumnName.toUpperCase().equals("EQUIPMENTCONFIGTEMPLATE_ID"))
                     referenceTable = "TM_ENTITYTEMPLATE";
             }

             if (createTable)
             {
                 writer.append("   " + ColumnName + getSpace(35 - ColumnName.length()) + dateType);
                 if (isNotNull != null && isNotNull.equalsIgnoreCase("Y"))
                     writer.append(" not null");

                 if ( (i + 1) <= rowAmount && isOracleColumn(rows.get(i+1))) {
                	 writer.append(",");
                 }
                     
             }
             else
             {
                 writer.append("alter table "+tableName+" add "+ColumnName+ " " + dateType + ";");
                 delWriter.append("alter table "+tableName+" drop column "+ColumnName+ ";");
                 delWriter.newLine();
             }

              writer.newLine();

              commentscripts.add("comment on column "+tableName+"."+ColumnName+"  is '"+chineseName+"';");

              if (ColumnName.equalsIgnoreCase("ID") || ColumnName.equalsIgnoreCase("EXTENSIONID"))
                  keyScripts.addElement("alter table "+tableName+"  add constraint "+getOracleName("PK_",tableName,null)+" primary key ("+ColumnName+");");
              if (ColumnName.equalsIgnoreCase("EXTENSIONID") || isFk)
                  keyScripts.add("alter table "+tableName+"  add constraint " + getOracleName("FK_",tableName,ColumnName)+" foreign key ("+ColumnName+")  references "+referenceTable+" (ID);");
              if (isFk && !ColumnName.equalsIgnoreCase("EXTENSIONID"))
                  indexScripts.add("create index "+getOracleName("IDX_",tableName,ColumnName)+" on "+tableName+" ("+ColumnName+");");
        }

        if (createTable)
        {
            writer.append(");");
            writer.newLine();
        }

        for (int i = 0; i < commentscripts.size(); i++)
        {
            writer.write( (String) commentscripts.elementAt(i));
            if (i + 1 <= commentscripts.size())
                writer.newLine();
        }

        for (int i = 0; i < keyScripts.size(); i++)
        {
            writer.write( (String) keyScripts.elementAt(i));
            if (i + 1 <= keyScripts.size())
                writer.newLine();
        }

        for (int i = 0; i < indexScripts.size(); i++)
        {
            writer.write( (String) indexScripts.elementAt(i));
            if (i + 1 <= indexScripts.size())
                writer.newLine();
        }

        if (createTable && !tableName.toUpperCase().startsWith("E_"))
            writer.append("create sequence " + getOracleName("SEQ_", tableName, null) + ";");

        writer.newLine();
        writer.newLine();
        writer.newLine();
        writer.flush();

        if (createTable && !tableName.toUpperCase().startsWith("E_"))
        {
            delWriter.append("drop sequence " + getOracleName("SEQ_", tableName, null) + ";");
            delWriter.newLine();
        }
        if (createTable)
        {
            delWriter.append("drop table " + tableName + ";");
            delWriter.newLine();
        }

        delWriter.newLine();
        delWriter.newLine();
        delWriter.newLine();
        delWriter.flush();
    }
}

/**
 * 封装jcom的
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
 * @author wusuirong
 *
 */
class WordDoc {
	IDispatch doc;
	IDispatch wdApp;
	
	List<WordTable> tables = new ArrayList<WordTable>();
	
	public WordDoc(String filePath) throws JComException {
		
		wdApp = new IDispatch(MSOfficeEnvironment.getReleaseManager(), "Word.Application");
        wdApp.put("Visible", new Boolean(false));

        IDispatch docs = (IDispatch) wdApp.get("Documents");
        doc = (IDispatch) docs.method("Open", new Object[]{filePath});
        
        IDispatch msTables = (IDispatch) doc.get("Tables");
		int tableAmount = ((Integer) msTables.get("Count")).intValue();

		for (int tabIdx = 1; tabIdx <= tableAmount; tabIdx++) {
			IDispatch msTable = (IDispatch) msTables.method("item", new Object[]{new Integer(tabIdx)});
			WordTable table = new WordTable();
			table.setTable(msTable);
			tables.add(table);
		}
	}
	
	/**
	 * 返回word文档中的所有表格
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
 * @author wusuirong
 *
 */
class WordTable {
	IDispatch table;
	List<WordTableRow> rows = new ArrayList<WordTableRow>();

	public void setTable(IDispatch table) throws JComException {
		this.table = table;
		
		IDispatch msRows = ( (IDispatch) table.get("rows"));
		int rowAmount = ((Integer) msRows.get("Count")).intValue();

		for (int rowIdx = 1; rowIdx <= rowAmount; rowIdx++) {
			IDispatch msRow =(IDispatch) msRows.method("item", new Object[]{new Integer(rowIdx)});
			WordTableRow row = new WordTableRow();
			row.setRow(msRow);
			rows.add(row);
		}
	}
	
	public List<WordTableRow> getRows() throws JComException {
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
			IDispatch msCell = (IDispatch) msCells.method("item", new Object[]{new Integer(cellIdx)});
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
 * @author wusuirong
 *
 */
class WordTableCell {
	IDispatch cell;
	
	public void setCell(IDispatch cell) {
		this.cell = cell;
	}
	
	public String getCellText() throws JComException {
		return (String) ((IDispatch) cell.get("Range")).get("Text");
	}
}