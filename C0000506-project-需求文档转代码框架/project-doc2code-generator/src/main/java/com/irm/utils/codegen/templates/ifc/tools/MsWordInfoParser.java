package com.irm.utils.codegen.templates.ifc.tools;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import jp.ne.so_net.ga2.no_ji.jcom.IDispatch;
import jp.ne.so_net.ga2.no_ji.jcom.JComException;
import jp.ne.so_net.ga2.no_ji.jcom.ReleaseManager;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.integration.core.definition.constant.IntegrationProtocolTypeEnum;
import com.irm.utils.codegen.templates.GeneralGenerator;
import com.irm.utils.codegen.utils.Comment;
import com.irm.utils.codegen.utils.InformationContainer;
import com.irm.utils.codegen.utils.MessageContainer;
import common.util.Assertion;
import common.util.Detect;

@Comment("*****************************************"
		+ "\r\n任务：MsWordInfoParser" 
		+ "\r\n用途：收集word文档中的表格信息" 
		+ "\r\n*****************************************")
public class MsWordInfoParser extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(MsWordInfoParser.class);
	
	private File wordDoc;
	
	
	public MsWordInfoParser(File wordDoc) {
		this.wordDoc = wordDoc;
	}
	
	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		boolean success = false;
		
		MSOfficeEnvironment.init();

		WordDoc msWord = null;

		try {
			msWord = new WordDoc(wordDoc);
			List<WordTable> tables = msWord.getTables();
			if (!Detect.notEmpty(tables)) {
				System.out.println("文档中没有表格，无法解析");
				System.exit(0);
			}
			if (1 < tables.size()) {
				System.out.println("文档中只能有一个表格，不想支持多个表格");
				System.exit(0);
			}
			
			WordTable table = tables.get(0);

			String tableType = getTableType(table);
			if (tableType != null
					&& "系统接口方法定义表".equals(tableType)) {
				parseIfcDefinition(table, infoContainer);
			}

			success = true;
		} catch (Exception e) {
			e.printStackTrace();
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
		
		if (!success) {
			System.out.println("解析word失败");
			System.exit(0);
		}
	}
	

	public void parseIfcDefinition(WordTable table, InformationContainer infoContainer) {
		IfcDefinition result = new IfcDefinition();

		result.setInterfaceProviderName(getInterfaceProviderName(table));
		result.setInterfaceClientName(getInterfaceClientName(table));
		result.setServiceEntryOfInterfaceInT3(getServiceEntryOfInterfaceInT3(table));


		inputInfoAutomatically(infoContainer, Const.INTERFACE_METHOD_CN_NAME_IN_T3DOC, getInterfaceMethodChineseNameInT3(table));
		inputInfoAutomatically(infoContainer, Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC, getInterfaceMethodEnglishCodeInT3(table));
		inputInfoAutomatically(infoContainer, Const.INTERFACE_METHOD_ENUM_CONST, getConstantKeyOfInterface(table));
		
		// 对方系统名列表
		inputInfoAutomatically(infoContainer, Const.REMOTE_SYSTEM_CODE_LOWERCASE, getOppositeSystemCodeInPackagePath(table));

		// 接口种类列表
		inputInfoAutomatically(infoContainer, Const.INTEGRATION_FUNCTION_BUSINESS_TYPE, getFunctionTypeOfInterface(table));

		if (isIrmsProvideService(table)) {
			inputInfoAutomatically(infoContainer, Const.IRMS_PROVIDE_SERVICE, "Y");
		} else {
			inputInfoAutomatically(infoContainer, Const.IRMS_PROVIDE_SERVICE, "N");
		}
		

		inputInfoAutomatically(infoContainer, Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE, getJavaServiceClassNameWithoutSystemCode(table));
		inputInfoAutomatically(infoContainer, Const.SERVICE_DESCRIPTION, getServiceDescriptionOfInterfaceInT3(table));

		inputInfoAutomatically(infoContainer, Const.JAVA_SERVICE_METHODNAME, getJavaMethodName(table));
		inputInfoAutomatically(infoContainer, Const.METHOD_DESCRIPTION, getInterfaceDescriptionInT3(table));

		inputInfoAutomatically(infoContainer, Const.SERVICE_CLIENT_SYSTEM_CODE_UPPERCASE, getInterfaceClientCode(table));
		inputInfoAutomatically(infoContainer, Const.SERVICE_SERVER_SYSTEM_CODE_UPPERCASE, getInterfaceProviderCode(table));
		

		inputInfoAutomatically(infoContainer, Const.INTERFACE_PROTOCOL_TYPE, getProtocolTypeEnum(table).toString());

		inputInfoAutomatically(infoContainer, Const.INTERFACE_FUNCTION_DEPLOY_PROVINCE, getProvinceName(table));
		inputInfoAutomatically(infoContainer, Const.AXI14_ENDPOINT_URL_KEY, getAxis14WebServiceEndPoint(table));
		
		inputInfoAutomatically(infoContainer, Const.T3_DOC_NAME, getT3DocName(table));
		inputInfoAutomatically(infoContainer, Const.T3_WRITER, getT3DocWriter(table));
		
		infoContainer.setMessageClassDefinitions(getMessageClassDefinitions(table));
		
	}
	
	
	/**
	 * 获取表格的第x行，第y列单元格的内容
	 * row和col的idx都从0算起
	 * 
	 * @param table
	 * @param rowIdx
	 * @param colIdx
	 * @return
	 * @throws Exception
	 */
	private static String getCellText(WordTable table, int rowIdx, int colIdx) {
		WordTableRow row = table.getRow(rowIdx);
		WordTableCell cell = row.getCell(colIdx);
		return cell.getCellText();
	}	
	
	/**
	 * 取得表格的类型，比如系统接口方法定义表
	 * @param table
	 * @return
	 */
	private static String getTableType(WordTable table) {
		return getCellText(table, 0, 1);
	}
	
	/**
	 * 取得接口方法中文名
	 * @param table
	 * @return
	 */
	private static String getInterfaceMethodChineseNameInT3(WordTable table) {
		return getCellText(table, 1, 1);
	}
	
	/**
	 * 取得需求文档名
	 * @param table
	 * @return
	 */
	private static String getT3DocName(WordTable table) {
		return getCellText(table, 2, 1);
	}
	
	/**
	 * 取得需求人
	 * @param table
	 * @return
	 */
	private static String getT3DocWriter(WordTable table) {
		return getCellText(table, 3, 1);
	}
	
	/**
	 * 取得接口提供方名称
	 * @param table
	 * @return
	 */
	private static String getInterfaceProviderName(WordTable table) {
		return getCellText(table, 4, 1);
	}
	
	/**
	 * 取得接口提供方缩写
	 * 缩写默认返回全大写
	 * @param table
	 * @return
	 */
	private static String getInterfaceProviderCode(WordTable table) {
		String code = getCellText(table, 5, 1);
		return code.toUpperCase();
	}
	
	/**
	 * 取得接口使用方名称
	 * @param table
	 * @return
	 */
	private static String getInterfaceClientName(WordTable table) {
		return getCellText(table, 6, 1);
	}
	
	/**
	 * 取得接口使用方缩写
	 * @param table
	 * @return
	 */
	private static String getInterfaceClientCode(WordTable table) {
		String code = getCellText(table, 7, 1);
		return code.toUpperCase();
	}
	
	/**
	 * 取得接口所属服务编码
	 * @param table
	 * @return
	 */
	private static String getServiceEntryOfInterfaceInT3(WordTable table) {
		return getCellText(table, 8, 1);
	}
	
	/**
	 * 取得接口所属服务说明
	 * @param table
	 * @return
	 */
	private static String getServiceDescriptionOfInterfaceInT3(WordTable table) {
		return getCellText(table, 9, 1);
	}
	
	/**
	 * 取得T3文档中的接口英文名
	 * @param table
	 * @return
	 */
	private static String getInterfaceMethodEnglishCodeInT3(WordTable table) {
		return getCellText(table, 10, 1);
	}
	
	/**
	 * 取得T3文档中的接口功能说明
	 * @param table
	 * @return
	 */
	private static String getInterfaceDescriptionInT3(WordTable table) {
		return getCellText(table, 11, 1);
	}
	
	/**
	 * 取得server端代码的接口包路径
	 * @param table
	 * @return
	 */
//	private static String getPackageNameInServerProject(WordTable table) {
//		return getCellText(table, 13, 0);
//	}
	
	/**
	 * 取得接口方法的英文常量名
	 * 用于生成常量枚举类(ex:SEND_QQ_MSG):(不能为空)
	 * 默认返回全大写
	 * @param table
	 * @return
	 */
	private static String getConstantKeyOfInterface(WordTable table) {
		String code = getCellText(table, 13, 0);
		return code.toUpperCase();
	}
	
	/**
	 * 对方系统编码
	 * 用于生成包路径和类名
	 * 取值范围: demo,eoms,nims,nms,pboss,sso,tnms,wps,zznodetnms,dnms,gnms
	 * 默认返回全小写
	 * @param table
	 * @return
	 */
	private static String getOppositeSystemCodeInPackagePath(WordTable table) {
		String code = getCellText(table, 15, 0);
		return code.toLowerCase();
	}
	
	/**
	 * 业务接口功能种类
	 * 例子列表: circuitconfig;opticalconfig;ponconfig;synlocation
	 * 输入业务接口功能种类以生成模板的路径,功能种类指:工单类,单点登录类,光路配置类等(ex:im):(不能为空)
	 * 默认返回全小写
	 * @param table
	 * @return
	 */
	private static String getFunctionTypeOfInterface(WordTable table) {
		String code = getCellText(table, 17, 0);
		return code.toLowerCase();
	}
	
	/**
	 * 业务接口是否是IRMS提供服务
	 * 用于生成类名
	 * 取值范围: Y,N
	 * @param table
	 * @return
	 */
	private static boolean isIrmsProvideService(WordTable table) {
		String str = getCellText(table, 19, 0);
		if ("n".equalsIgnoreCase(str)) {
			return false;
		}
		if ("no".equalsIgnoreCase(str)) {
			return false;
		}
		return true;
	}
	
	/**
	 * 业务接口类名称
	 * 不要在前面加系统名大写(ex:MessageSenderService):(不能为空)
	 * 默认第一个字母大写，符合java编码规范
	 * @param table
	 * @return
	 */
	private static String getJavaServiceClassNameWithoutSystemCode(WordTable table) {
		String code = getCellText(table, 21, 0);
		Assertion.endsWith(code, "Service", "业务接口类名称应该以Service结尾");
		code = code.substring(0, 1).toUpperCase() + code.substring(1);
		return code;
	}
	
	/**
	 * 业务方法名
	 * 用于生成业务类的方法(ex:sendQqMessage):(不能为空)
	 * 默认第一个字母小写，符合java编码规范
	 * @param table
	 * @return
	 */
	private static String getJavaMethodName(WordTable table) {
		String code = getCellText(table, 23, 0);
		code = code.substring(0, 1).toLowerCase() + code.substring(1);
		return code;
	}
	
	/**
	 * 接口使用的传输协议:
	 * 取值范围: WEBSERVICE_AXIS14,WEBSERVICE_CXF,MQ_WEBSPHERE
	 * @param table
	 * @return
	 */
	private static IntegrationProtocolTypeEnum getProtocolTypeEnum(WordTable table) {
		String name = getCellText(table, 25, 0);
		return IntegrationProtocolTypeEnum.valueOf(name);
	}
	
	/**
	 * 接口发布省份拼音
	 * 用于生成包路径(ex:general):
	 * 取值范围: general,zhejiang,shanghai,jiangxi,gansu,shanxi
	 * @param table
	 * @return
	 */
	private static String getProvinceName(WordTable table) {
		String code = getCellText(table, 27, 0);
		return code.toLowerCase();
	}
	
	/**
	 * axis14工程中applicationContext.properties的webservice端口服务key
	 * (ex:irms.integration.sso.statistics.shanghai.webservice.endpoint)(不能为空)
	 * @param table
	 * @return
	 */
	private static String getAxis14WebServiceEndPoint(WordTable table) {
		String code = getCellText(table, 29, 0);
		if (!code.startsWith("irms2")
				&& !code.contains("2irms")) {
			throw new IllegalArgumentException("WebService的EndPoint定义要符合irms2xxx或xxx2irms开头的规则");
		}
		Assertion.endsWith(code, ".webservice.endpoint", "WebService的EndPoint定义要符合webservice.endpoint结尾的规则");
		return code;
	}
	
	/**
	 * 找出第一个cell的内容以key开始的第一行行号
	 * @param table
	 * @param key
	 * @return
	 */
	private static int findFirstRowNumOfKeyStartInFirstCell(WordTable table, int startRowNo, String key) {
		List<WordTableRow> rows = table.getRows();
		for (int i=startRowNo; i<rows.size(); i++) {
			WordTableRow row = rows.get(i);
			List<WordTableCell> cells = row.getCells();
			
			if (row.getCell(0).getCellText().startsWith(key)) {
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * 解析表格中关于参数类的定义
	 * @param table
	 * @return
	 */
	private static List<MessageClassDefinition> getMessageClassDefinitions(WordTable table) {
		List<MessageClassDefinition> definitions = new ArrayList<MessageClassDefinition>();
		int totalRowCount = table.getRowCount();
		int startRowNum = findFirstRowNumOfKeyStartInFirstCell(table, 0, "参数类型");
		
		if (0 < startRowNum) {
			MessageClassDefinition definition = getMessageClassDefinition(table, startRowNum);
			definitions.add(definition);

			while (0 < definition.getFieldInfos().size()) {
				/*
				 * 因为每个类前面有3行定义
				 * ---------------------
				 * 参数类型	参数标识	参数说明	所属父参数标识			
				 * 入参						
				 * 字段英文名称	字段中文名称	字段类型	是否必填	字段说明	Java属性名	Java属性类型
				 * ---------------------
				 * 所以这里在上一个类开始处+字段定义数+3才是下个类定义的开始
				 */
				startRowNum = findFirstRowNumOfKeyStartInFirstCell(table, startRowNum+1, "参数类型");
				if (0 < startRowNum
						&& startRowNum < totalRowCount) {
					definition = getMessageClassDefinition(table, startRowNum);
					definitions.add(definition);
				} else {
					break;
				}
			}
		}
		
		return definitions;
	}
	
	/**
	 * 解析一个参数类的定义
	 * @param table
	 * @param startRowNum
	 * @return
	 */
	private static MessageClassDefinition getMessageClassDefinition(WordTable table, int startRowNum) {
		MessageClassDefinition definition = new MessageClassDefinition();
		
		/*
		 * 第一行是
		 * 参数类型	参数标识	参数说明	所属父参数标识
		 * 所以这里+1
		 */
		WordTableRow secondRow = table.getRow(startRowNum+1);
		WordTableCell firstCell = secondRow.getCell(0);
		
		//“入参”或“出参”
		String argumentType = firstCell.getCellText();
		
		if (argumentType.startsWith("入参")
				|| argumentType.startsWith("出参")) {
			
			if (argumentType.startsWith("入参")) {
				definition.setRequestMessage(true);
			} else {
				definition.setRequestMessage(false);
			}
			
			//入参Java名称，即“参数标识”
			WordTableCell nameCell = secondRow.getCell(1);
			String className = nameCell.getCellText();
			if (Detect.notEmpty(className)) {
				definition.setMessageClassName(className);
			} else {
				throw new IllegalArgumentException("“参数标识”没填");
			}
			
			System.out.println("\r\n\r\n" + argumentType + ":" + definition.getMessageClassName());
			//参数说明
			WordTableCell descCell = secondRow.getCell(2);
			String argumentGroupDescription = descCell.getCellText();
			
			if (Detect.notEmpty(argumentGroupDescription)) {
				definition.setMessageClassDescription(argumentGroupDescription);
			} else {
				throw new IllegalArgumentException("“参数说明”没填");
			}
			
			//父参数名称
			WordTableCell fatherMessageNameCell = secondRow.getCell(3);
			String fatherMessageName = fatherMessageNameCell.getCellText();
			if (Detect.notEmpty(fatherMessageName)) {
				definition.setFatherMessageName(fatherMessageName);
			}
			
			//消息风格
			WordTableCell msgStyleCell = secondRow.getCell(4);
			String msgStyle = msgStyleCell.getCellText();
			if (Detect.notEmpty(msgStyle)) {
				msgStyle = msgStyle.toLowerCase();
				definition.setMessageStyle(msgStyle);
			} else {
				definition.setMessageStyle("normal");
			}
			
			//列头
			
			
			/*
			 * 因为每个类前面有3行定义
			 * ---------------------
			 * 参数类型	参数标识	参数说明	所属父参数标识			
			 * 入参						
			 * 字段英文名称	字段中文名称	字段类型	是否必填	字段说明	Java属性名	Java属性类型
			 * ---------------------
			 * 所以这里在类定义开始处+3才是字段定义的开始
			 */
			// 对当前类的所有字段定义遍历一遍，因为不知道有多少字段，所以先默认最多能遍历到表格最后，看遍历时遇到下个类定义的开始再终止
			System.out.println("参数包含的字段清单");
			int totalRowCount = table.getRowCount();
			for (int i=startRowNum+3; i<totalRowCount; i++) {
				FieldInfo fieldInfo = new FieldInfo();
				
				WordTableRow row = table.getRow(i);
				
				//如果是空行则跳过
				if (!Detect.notEmpty(row.getCell(0).getCellText())) {
					continue;
				}
				
				//如果遇到下一个类定义的开始则结束当前遍历
				if (row.getCell(0).getCellText().startsWith("参数类型")) {
					break;
				}
				//字段英文名称
				String argEnName = row.getCell(0).getCellText();
				if (!Detect.notEmpty(argEnName)) {
					throw new IllegalArgumentException("字段英文名称不能为空,rowNum=" + i);
				}
				fieldInfo.setFieldEnName(argEnName);
				//字段中文名称
				String argCnName = row.getCell(1).getCellText();
				if (!Detect.notEmpty(argCnName)) {
					throw new IllegalArgumentException("字段中文名称不能为空,rowNum=" + i);
				}
				System.out.println(argCnName + "\t" + argEnName);
				fieldInfo.setFieldCnName(argCnName);
				//字段类型
				String argDataType = row.getCell(2).getCellText();
				
				if (Detect.notEmpty(argDataType)) {
					argDataType = argDataType.toLowerCase();
					if (argDataType.startsWith("string")) {
						fieldInfo.setFieldDataType("String");
					} else if (argDataType.startsWith("int")) {
						fieldInfo.setFieldDataType("int");
					} else if (argDataType.startsWith("date")) {
						fieldInfo.setFieldDataType("date");
					} else if (argDataType.startsWith("enum")) {
						fieldInfo.setFieldDataType("enum");
					} else {
						fieldInfo.setFieldDataType("String");
					}
				} else {
					fieldInfo.setFieldDataType("String");
				}
				
				
				//是否必填
				String argCanNotNull = row.getCell(3).getCellText();
				if (Detect.notEmpty(argCanNotNull)
						&& ("yes".equalsIgnoreCase(argCanNotNull))
							|| "y".equalsIgnoreCase(argCanNotNull)
							|| "是".equalsIgnoreCase(argCanNotNull)
						) {
					fieldInfo.setCanNotNull(true);
				} else {
					fieldInfo.setCanNotNull(false);
				}
				//字段说明
				String argDescription = row.getCell(4).getCellText();
				fieldInfo.setFieldDescription(argDescription);
				//Java属性名
				String javaFieldName = row.getCell(5).getCellText();
				if (!Detect.notEmpty(javaFieldName)) {
					String str = argEnName;
					String[] strs = str.split("[_-]");
					if (1 == strs.length) {
						if (strs[0].equals(strs[0].toUpperCase())) {
							javaFieldName = strs[0].toLowerCase();
						} else {
							javaFieldName = strs[0].substring(0, 1).toLowerCase() + strs[0].substring(1);
						}						
					} else {
						for (int x=0; x<strs.length; x++) {
							if (0 == x) {
								strs[x] = strs[x].substring(0, 1).toLowerCase() + strs[x].substring(1).toLowerCase();
							} else {
								strs[x] = strs[x].substring(0, 1).toUpperCase() + strs[x].substring(1).toLowerCase();
							}							
							javaFieldName += strs[x];
						}
					}
					
				}
				fieldInfo.setJavaFieldName(javaFieldName);
				
				//Java属性类型
				String javaDataType = row.getCell(6).getCellText();
				if (!Detect.notEmpty(javaDataType)) {
					argDataType = argDataType.toLowerCase();
					if (argDataType.startsWith("string")) {
						fieldInfo.setJavaFieldDataType("String");
					} else if (argDataType.startsWith("int")) {
						fieldInfo.setJavaFieldDataType("int");
					} else if (argDataType.startsWith("date")) {
						fieldInfo.setJavaFieldDataType("date");
					} else if (argDataType.startsWith("enum")) {
//						fieldInfo.setJavaFieldDataType("enum");
					} else {
						fieldInfo.setJavaFieldDataType("String");
					}
				} else {
					if (javaDataType.startsWith("string")) {
						fieldInfo.setJavaFieldDataType("String");
					} else if (javaDataType.startsWith("int")) {
						fieldInfo.setJavaFieldDataType("int");
					} else if (javaDataType.startsWith("date")) {
						fieldInfo.setJavaFieldDataType("date");
					} else if (javaDataType.startsWith("list")) {
						fieldInfo.setJavaFieldDataType("list");
					} else if (javaDataType.startsWith("enum")) {
						fieldInfo.setJavaFieldDataType(javaDataType);
					} else {
						fieldInfo.setJavaFieldDataType("String");
					}
				}

				
				
//				//数据库字段英文名
//				String dbFieldEnName = row.getCell(7).getCellText();
//				//数据库字段名称
//				String dbFieldCnName = row.getCell(8).getCellText();
//				//数据库字段类型
//				String dbFieldDataType = row.getCell(9).getCellText();
				
				definition.getFieldInfos().add(fieldInfo);
			}
		}
		
		return definition;
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













