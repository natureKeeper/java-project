--在脚本系统中查某时间段执行的脚本
SELECT * FROM t_script WHERE ID IN (
SELECT script_id FROM R_SCRIPT_ENVIRONMENT WHERE latest_exec_time BETWEEN to_date('2014-08-11','yyyy-mm-dd') AND to_date('2014-08-12','yyyy-mm-dd'))