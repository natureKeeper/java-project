接口模板说明
${serviceDescription}
${methodDescription}
${functionNameInT3Doc}

RequestXmlAnnotation.xml
	是用于生成模拟页面的模板，通过解析xml的注释生成模拟页面
	这里写法是key=value的格式，如果入参有2个以上参数是xml的，则用分隔符分隔2个xml，比如
	arg1=<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
	<aaa/>
	##############arguments spliter#################
	arg2=<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
	<bbb/>
	这里的key（arg1，arg2等）需要和request模板中的key匹配
	最后没有参数了就不要出现
	##############arguments spliter#################
	以免解析出错

输入模板：
