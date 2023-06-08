module.exports = (message) => ` 
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

 </head> 
 <body>  

				<h2 style="color: #767E80; margin: 0; text-align: center; background-color: #ECF0F1; padding: 20px; font-wieght: bold; text-transform: uppercase;">${process.env.HOSTNAME}</h2> 
		
		
<br>
<br>
	<div style="padding: 0 40px;">
		<h2 style="color: #000000; margin-top: 0;">إعادة تعيين كلمة المرور</h2> 
<h3 style="color: #767E80; margin: 0; font-weight:normal;">انقر على الزر لإعادة تعيين كلمة المرور الخاصة بك.</h3>
<br>
<br>
<a style="text-decoration: none;" href="${message.link}"><div style="background-color: #424EF8; color: white; border-radius: 5px; display: block; width: 100%; text-align: center; padding: 17px; box-sizing: border-box;">إعادة تعيين كلمة المرور</div></a>
<br>
<br>
<h3 style="color: #767E80; margin: 0; font-weight:normal;">إذا لم تكن أنت، يرجى تجاهل هذا البريد الإلكتروني.<br /><br />شكرًا لك،<br />فريق ${process.env.HOSTNAME}</h3>
<br>
<br>
<hr style="display: block; width: 100%;"/>
<br>
<br>
<p style="color: #767E80; margin: 0; font-weight:normal;">إذا كان لديك مشكلة في النقر على الزر،<br /> يرجى نسخ عنوان الرابط أدناه إلى متصفح الويب الخاص بك.</p>
<br>
	
<p style="color: #767E80; margin: 0; font-size: 0.9em;">${message.link}</p>
</div>

 </body>
</html>
`;