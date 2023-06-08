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
		<h2 style="color: #000000; margin-top: 0;">Verify your email address</h2> 
<h3 style="color: #767E80; margin: 0; font-weight:normal;">Thanks for signing up for<br /> ${process.env.HOSTNAME}! Verify your email to<br /> continue.<h3>
<br>

<h3 style="color: #767E80; margin: 0; font-weight:normal;">Your verification code is:<h3>
<a style="text-decoration: none;" href="#"><div style="background-color: #424EF8; color: white; border-radius: 5px; display: block; width: 100%; text-align: center; padding: 17px; box-sizing: border-box;">${message.code}</div></a>
<br>
<br>
<h3 style="color: #767E80; margin: 0; font-weight:normal;">If it wasn't you, please ignore this<br /> email.<br /><br />Thanks,<br />${process.env.HOSTNAME} Team</h3>
<br>
<br>
<hr style="display: block; width: 100%;"/>
</div>

 </body>
</html>
`;