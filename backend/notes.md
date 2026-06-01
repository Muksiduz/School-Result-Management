
### Auth Routes

#### /api/v1/auth/login 
post - login for admin - username and password is required

#### /api/v1/auth//create-user
post - admin create users - protected and admin only - name, username, password and role is required

#### /api/v1/auth/get-all-user
get - admin get all users - protected and admin only 

#### /api/v1/auth/update-user/:id
put - admin update user - protected and admin only - name, username and role is required

#### /api/v1/auth/delete-user/:id
delete - admin delete user - protected and admin only 