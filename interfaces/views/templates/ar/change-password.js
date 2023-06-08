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
		<h2 style="color: #000000; margin-top: 0;">تم تغيير كلمة المرور الخاصة بك</h2> 
<h3 style="color: #767E80; margin: 0; font-weight:normal;">تم تغيير كلمة المرور الخاصة بك بنجاح.</h3>
<br>
<br>
<h3 style="color: #767E80; margin: 0; font-weight:normal;">إذا لم تكن أنت من قام بتغيير كلمة المرور، يرجى إعادة تعيين كلمة المرور، حيث أن شخصًا آخر قد يكون قام بتغييرها.<br /><br />شكرًا لك،<br />فريق ${process.env.HOSTNAME}</h3>
<br>
<br>
<hr style="display: block; width: 100%;"/>
</div>

 </body>
</html>
`;