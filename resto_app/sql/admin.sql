INSERT INTO user(name, 
                 username, 
                 password, 
                 email, 
                 address, 
                 phone, 
                 image_url, 
                 role) 
            VALUES(
                "admin_0",
                "adm00n",
                "admin_resto_app@gmail.com",
                "Admin",
                "000000000000",
                "/static/img/default.png",
                "admin"
            )
WHERE NOT EXISTS (
    SELECT 1 FROM user WHERE username = "adm00n",
)