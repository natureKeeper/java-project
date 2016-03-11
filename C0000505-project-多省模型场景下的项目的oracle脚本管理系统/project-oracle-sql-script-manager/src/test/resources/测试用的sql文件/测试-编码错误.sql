--上海传输光路调度工单附件ftp配置
delete sm_preference where code='shanghaiOpticalOrderAttachmentFtpConfig';
insert into sm_preference(id,name,code,memo,enable,type,value,creator,updater)
values(seq_sm_preference.nextval,'上海传输光路调度工单附件ftp配置','shanghaiOpticalOrderAttachmentFtpConfig','上海传输光路调度中传输系统回复配置信息时会提供附件',1,'java.lang.String','aaa','wusuirong','wusuirong');