cvs主干分支代码合并器
改动分支代码后，提交前，使用此工具合并代码到主干
然后自动调用tortoiseCvs提交分支代码

64位patch
把patch目录中的mfc71u.dll复制到C:\Windows\SysWOW64

默认使用winmerge的unicode版本进行合并
注意如果比较的文件编码是不带BOM头的utf-8编码，比如java文件，则需要在winmerge的设置里设置codepage=65001
说明如下
简体中文 codepage=936
繁体中文 codepage=950
UTF-8 codepage=65001