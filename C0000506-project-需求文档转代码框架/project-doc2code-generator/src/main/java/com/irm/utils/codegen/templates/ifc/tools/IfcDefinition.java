package com.irm.utils.codegen.templates.ifc.tools;

import java.util.ArrayList;
import java.util.List;

import com.irm.integration.core.definition.constant.IntegrationProtocolTypeEnum;

public class IfcDefinition {
	private String tableType;//表格类型
	private String interfaceMethodCnNameInT3;
	private String t3DocName;//需求文档	
	private String t3DocWriter;//需求人	
	private String interfaceProviderName;//服务提供方名称	
	private String interfaceProviderCode;//服务提供方缩写	
	private String interfaceClientName;//服务使用方名称	
	private String interfaceClientCode;//服务使用方缩写	
	private String serviceEntryOfInterfaceInT3;//接口服务入口	
	private String serviceDescriptionOfInterfaceInT3;//接口服务说明	
	private String interfaceCodeInT3;//接口方法名	
	private String interfaceDescriptionInT3;//接口方法说明	
	
//	private String packageNameInServerProject;//server端代码的接口包路径

	private String constantKeyOfInterface;//输入业务接口方法的英文常量名以生成常量类(ex:SEND_QQ_MSG):(不能为空)

	private String oppositeSystemCodeInPackagePath;//输入对方系统名以生成包路径和类名.取值范围: demo,eoms,nims,nms,pboss,sso,tnms,wps,zznodetnms,dnms,gnms

	private String functionTypeOfInterface;//业务接口功能种类例子列表: circuitconfig;opticalconfig;ponconfig;synlocation.输入业务接口功能种类以生成包路径,功能种类指:工单类,单点登录类,光路配置类等(ex:im):(不能为空)

	private boolean irmsProvideService;//业务接口是否是IRMS提供服务(Y/N)，以生成类名.取值范围: Y,N

	private String javaServiceClassName;//输入业务接口类名称，不要在前面加系统名大写(ex:MessageSenderService):(不能为空)

	private String javaMethodName;//输入业务方法名以生成业务类的方法(ex:sendQqMessage):(不能为空)

	private IntegrationProtocolTypeEnum interfaceProcotolType;//输入接口使用的传输协议:取值范围: WEBSERVICE_AXIS14,WEBSERVICE_CXF,MQ_WEBSPHERE

	private String provinceName;//接口发布省份拼音以生成包路径(ex:general):取值范围: general,zhejiang,shanghai,jiangxi,gansu,shanxi

	private String axis14WebServiceEndPoint;//输入axis14工程中applicationContext.properties的webservice端口服务key,(ex:irms.integration.sso.statistics.shanghai.webservice.endpoint)(不能为空)

	private List<MessageClassDefinition> messageClassDefinitions;
	
	public IfcDefinition() {
		messageClassDefinitions = new ArrayList<MessageClassDefinition>();
	}

	public String getTableType() {
		return tableType;
	}

	public void setTableType(String tableType) {
		this.tableType = tableType;
	}

	public String getInterfaceMethodCnNameInT3() {
		return interfaceMethodCnNameInT3;
	}

	public void setInterfaceMethodCnNameInT3(String interfaceMethodCnNameInT3) {
		this.interfaceMethodCnNameInT3 = interfaceMethodCnNameInT3;
	}

	public String getT3DocName() {
		return t3DocName;
	}

	public void setT3DocName(String t3DocName) {
		this.t3DocName = t3DocName;
	}

	public String getT3DocWriter() {
		return t3DocWriter;
	}

	public void setT3DocWriter(String t3DocWriter) {
		this.t3DocWriter = t3DocWriter;
	}

	public String getInterfaceProviderName() {
		return interfaceProviderName;
	}

	public void setInterfaceProviderName(String interfaceProviderName) {
		this.interfaceProviderName = interfaceProviderName;
	}

	public String getInterfaceProviderCode() {
		return interfaceProviderCode;
	}

	public void setInterfaceProviderCode(String interfaceProviderCode) {
		this.interfaceProviderCode = interfaceProviderCode;
	}

	public String getInterfaceClientName() {
		return interfaceClientName;
	}

	public void setInterfaceClientName(String interfaceClientName) {
		this.interfaceClientName = interfaceClientName;
	}

	public String getInterfaceClientCode() {
		return interfaceClientCode;
	}

	public void setInterfaceClientCode(String interfaceClientCode) {
		this.interfaceClientCode = interfaceClientCode;
	}

	public String getServiceEntryOfInterfaceInT3() {
		return serviceEntryOfInterfaceInT3;
	}

	public void setServiceEntryOfInterfaceInT3(String serviceEntryOfInterfaceInT3) {
		this.serviceEntryOfInterfaceInT3 = serviceEntryOfInterfaceInT3;
	}

	public String getServiceDescriptionOfInterfaceInT3() {
		return serviceDescriptionOfInterfaceInT3;
	}

	public void setServiceDescriptionOfInterfaceInT3(String serviceDescriptionOfInterfaceInT3) {
		this.serviceDescriptionOfInterfaceInT3 = serviceDescriptionOfInterfaceInT3;
	}

	public String getInterfaceCodeInT3() {
		return interfaceCodeInT3;
	}

	public void setInterfaceCodeInT3(String interfaceCodeInT3) {
		this.interfaceCodeInT3 = interfaceCodeInT3;
	}

	public String getInterfaceDescriptionInT3() {
		return interfaceDescriptionInT3;
	}

	public void setInterfaceDescriptionInT3(String interfaceDescriptionInT3) {
		this.interfaceDescriptionInT3 = interfaceDescriptionInT3;
	}

//	public String getPackageNameInServerProject() {
//		return packageNameInServerProject;
//	}
//
//	public void setPackageNameInServerProject(String packageNameInServerProject) {
//		this.packageNameInServerProject = packageNameInServerProject;
//	}

	public String getConstantKeyOfInterface() {
		return constantKeyOfInterface;
	}

	public void setConstantKeyOfInterface(String constantKeyOfInterface) {
		this.constantKeyOfInterface = constantKeyOfInterface;
	}

	public String getOppositeSystemCodeInPackagePath() {
		return oppositeSystemCodeInPackagePath;
	}

	public void setOppositeSystemCodeInPackagePath(String oppositeSystemCodeInPackagePath) {
		this.oppositeSystemCodeInPackagePath = oppositeSystemCodeInPackagePath;
	}

	public String getFunctionTypeOfInterface() {
		return functionTypeOfInterface;
	}

	public void setFunctionTypeOfInterface(String functionTypeOfInterface) {
		this.functionTypeOfInterface = functionTypeOfInterface;
	}

	public boolean isIrmsProvideService() {
		return irmsProvideService;
	}

	public void setIrmsProvideService(boolean irmsProvideService) {
		this.irmsProvideService = irmsProvideService;
	}

	public String getJavaServiceClassName() {
		return javaServiceClassName;
	}

	public void setJavaServiceClassName(String javaServiceClassName) {
		this.javaServiceClassName = javaServiceClassName;
	}

	public String getJavaMethodName() {
		return javaMethodName;
	}

	public void setJavaMethodName(String javaMethodName) {
		this.javaMethodName = javaMethodName;
	}

	public IntegrationProtocolTypeEnum getInterfaceProcotolType() {
		return interfaceProcotolType;
	}

	public void setInterfaceProcotolType(IntegrationProtocolTypeEnum interfaceProcotolType) {
		this.interfaceProcotolType = interfaceProcotolType;
	}

	public String getProvinceName() {
		return provinceName;
	}

	public void setProvinceName(String provinceName) {
		this.provinceName = provinceName;
	}

	public String getAxis14WebServiceEndPoint() {
		return axis14WebServiceEndPoint;
	}

	public void setAxis14WebServiceEndPoint(String axis14WebServiceEndPoint) {
		this.axis14WebServiceEndPoint = axis14WebServiceEndPoint;
	}

	public List<MessageClassDefinition> getMessageClassDefinitions() {
		return messageClassDefinitions;
	}

	public void setMessageClassDefinitions(List<MessageClassDefinition> messageClassDefinitions) {
		this.messageClassDefinitions = messageClassDefinitions;
	}

}
