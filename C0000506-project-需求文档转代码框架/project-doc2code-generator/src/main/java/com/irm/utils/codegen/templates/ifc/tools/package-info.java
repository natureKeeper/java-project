/** 
 * <b>package-info不是平常类，其作用有三个:</b><br>
 * 1、为标注在包上Annotation提供便利；<br>
 * 2、声明包的私有类和常量；<br>
 * 3、提供包的整体注释说明。<br>
*/
package com.irm.utils.codegen.templates.ifc.tools;

class Const {
	static final String INTERFACE_METHOD_CN_NAME_IN_T3DOC = "接口中文名，比如取钱";
	static final String INTERFACE_METHOD_ENUM_CONST = "接口英文常量名，比如DEMO_TO_IRMS_WITHDRAW_MONEY";
	static final String REMOTE_SYSTEM_CODE_LOWERCASE = "对方系统名小写，比如demo";
	static final String INTEGRATION_FUNCTION_BUSINESS_TYPE = "接口功能类型英文名，比如config";
	static final String INTERFACE_METHOD_EN_CODE_IN_T3DOC = "需求文档中接口方法英文名，比如irmsWithdrawMoneyFunction";
	static final String INTERFACE_PROTOCOL_TYPE = "接口使用的协议类型，比如WEBSERVICE_AXIS14";
	
	static final String JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE = "业务接口类名称，不带系统缩写，比如moneyService";
	static final String JAVA_SERVICE_METHODNAME = "业务接口类的方法名称，比如withdrawMoney";
	static final String SERVICE_DESCRIPTION = "业务类描述，比如这是一个金融服务";
	static final String METHOD_DESCRIPTION = "接口方法描述，比如这是一个取款方法";
	static final String IRMS_PROVIDE_SERVICE = "描述业务接口是IRMS提供服务，还是是对端系统使用IRMS的服务";
	
	static final String SERVICE_CLIENT_SYSTEM_CODE_UPPERCASE = "接口调用方的英文大写编号，供模拟界面显示";
	static final String SERVICE_SERVER_SYSTEM_CODE_UPPERCASE = "接口提供方的英文大写编号，供模拟界面显示";
	
	static final String INTERFACE_FUNCTION_DEPLOY_PROVINCE = "接口发布省份";
	
	static final String AXI14_ENDPOINT_URL_KEY = "axis14工程中applicationContext.properties的webservice端口服务key";
	
	static final String T3_DOC_NAME = "T3文档";
	static final String T3_WRITER = "需求人";

}

class PropertyName {
	//server端工程路径
	static final String SERVER_PROJECT_SRC_PATH = "integration.server.project.src.path";
	//integration端工程路径
	static final String INTEGRATION_PROJECT_SRC_PATH = "integration.integration.project.src.path";
	//frontend端工程路径
	static final String FRONTEND_PROJECT_PATH = "integration.frontend.project.path";
	
	static final String FRONTEND_PROJECT_RESOURCES_PATH = "integration.frontend.project.resources.path";
	//axis14端工程路径
	static final String AXIS14_PROJECT_PATH = "integration.axis14.project.path";
	static final String AXIS14_PROJECT_SRC_PATH = "integration.axis14.project.src.path";
	static final String AXIS14_PROJECT_RESOURCES_PATH = "integration.axis14.project.resources.path";

	//接口名常量定义
	static final String INTEGRATION_CONST_DEFINE_CLASS_PATH = "integration.serviceDefinitionEnumClass.path";

	//接口包路径
	static final String SERVER_PACKAGE_PATH = "integration.server.package.path";
	static final String INTEGRATION_PACKAGE_PATH = "integration.integration.package.path";
	
	static final String AXIS14_PACKAGE_PATH = "integration.axis14.package.path";
	//接口开发中对方系统名列表
	static final String INTEGRATION_SYSTEM_NAMES = "integration.system.names";
	//接口开发中接口的功能种类
	static final String INTEGRATION_FUNCTION_TYPES = "integration.function.names";
	//接口配置文件路径
	static final String FRONTEND_INTEGRATION_CONFIG_PATH = "integration.frontend.integration.config.path";
}