
# Auth Routes

#### /api/v1/auth/login 
post - login for admin and all users - username and password is required

#### /api/v1/auth/create-user
post - admin create users - protected and admin only - name, username, password and role is required

#### /api/v1/auth/get-all-user
get - admin get all users - protected and admin only 

#### /api/v1/auth/update-user/:id
put - admin update user - protected and admin only - name, username and role is required

#### /api/v1/auth/delete-user/:id
delete - admin delete user - protected and admin only 




# classes Routes

#### /api/v1/classes/
Get - all the classes - By admins,teacher and viewers

#### /api/v1/classes/
Post - create classes - By admin and teachers - name (class name) is required

#### /api/v1/classes/:id
Put - update class - By admin only - name (class name) is required

#### /api/v1/classes/:id
Delete - delete class - By admin only




# Section Routes

#### /api/v1/sections/
GET - all the section - By admin,teacher and viewers

#### /api/v1/sections/class/:class_id
GET - sections by class - By admin,teacher and viewers

#### /api/v1/sections/
POST - create sections - By admin and teachers - name(section name) and class_id(because section is link to class) is required

### /api/v1/sections/:id
PUT - update section - By admin only - name  is required

### /api/v1/sectons/:id
DELETE - delete section - BY admin only 
