<!--
@Author: caoyx
@Description: 非业务接口文档
@CreateDate: 2018-01-05 11:46:13
 -->

1. 注册：/notLogin/register
>>     参数      |     类型  | 是否必须 | 描述
>> --------------|----------|----------|--------
>>      name     | string   |  true    | 用户名
>>   password    |  string  |  true    | 密码
>>password-repeat|  string  |  true    | 密码(再次)
>>    email      |  string  |  true    | 邮箱

2. 登录：/notLogin/login
>>     参数      |     类型  | 是否必须 | 描述
>> --------------|----------|----------|--------
>>      name     | string   |  true    | 用户名
>>   password    |  string  |  true    | 密码

3. 登出：/logined/logout