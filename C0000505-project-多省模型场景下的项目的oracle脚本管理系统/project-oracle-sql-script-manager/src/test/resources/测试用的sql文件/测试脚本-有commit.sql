--查接口日志
select id, name, code, value from sm_preference order by id;
commit;
insert into sm_preference(id,name,code,memo,enable,type,value,creator,updater)
values(seq_sm_preference.nextval,'中文测试','shanghaiOpticalOrderAttachmentFtpConfig','中文测试abc描述',1,'java.lang.String','aaa','wusuirong','wusuirong');