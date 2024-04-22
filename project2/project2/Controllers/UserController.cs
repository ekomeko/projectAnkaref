using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;


namespace project2.Controllers
{     




        [Route("api/[controller]")]
        [ApiController]
        public class UserController : ControllerBase
        {
            private IConfiguration _configuration;
            public UserController(IConfiguration configuration)
            {
                _configuration = configuration;
            }

            [HttpGet]
            [Route("GetUsers")]
            public JsonResult GetUsers()
            {
                string query = "select * from dbo.Users";
                DataTable table = new DataTable();
                string sqlDatasource = _configuration.GetConnectionString("project2DBcon");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }
                return new JsonResult(table);
            }

            public class Users
            {
                public string UserName { get; set; }
                public string UserMail { get; set; }
                public string UserPassword { get; set; }
                public string UserRole { get; set; }
            }


        [HttpPut]
        [Route("UpdateUser/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] Users updatedUser)
        {
            if (updatedUser == null)
            {
                return BadRequest("Invalid user data.");
            }

            string query = "UPDATE dbo.Users SET UserName = @UserName, UserMail = @UserMail, UserPassword = @UserPassword, UserRole = @UserRole WHERE UserId = @UserId";

            using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("project2DBcon")))
            {
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@UserId", userId);
                    myCommand.Parameters.AddWithValue("@UserName", updatedUser.UserName);
                    myCommand.Parameters.AddWithValue("@UserMail", updatedUser.UserMail);
                    myCommand.Parameters.AddWithValue("@UserPassword", updatedUser.UserPassword);
                    myCommand.Parameters.AddWithValue("@UserRole", updatedUser.UserRole);

                    try
                    {
                        await myCon.OpenAsync();

                        int rowsAffected = await myCommand.ExecuteNonQueryAsync();
                        if (rowsAffected > 0)
                        {
                            return Ok("User updated successfully.");
                        }
                        else
                        {
                            return NotFound($"User with ID {userId} not found.");
                        }
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, $"Internal server error: {ex.Message}");
                    }
                }
            }
        }






        [HttpPost]
            [Route("registration")]
            public string Registration(Users registration)
            {
                try
                {
                    string connectionString = _configuration.GetConnectionString("project2DBcon").ToString();

                    using (SqlConnection con = new SqlConnection(connectionString))
                    {
                        con.Open();

                        string query = "INSERT INTO dbo.Users (UserName, UserMail, UserPassword, UserRole) " +
                                       "VALUES (@UserName, @UserMail, @UserPassword, @UserRole)";

                        using (SqlCommand cmd = new SqlCommand(query, con))
                        {
                            cmd.Parameters.AddWithValue("@UserName", registration.UserName);
                            cmd.Parameters.AddWithValue("@UserMail", registration.UserMail);
                            cmd.Parameters.AddWithValue("@UserPassword", registration.UserPassword);
                            cmd.Parameters.AddWithValue("@UserRole", registration.UserRole);

                            int i = cmd.ExecuteNonQuery();

                            if (i > 0)
                            {
                                return "Veri eklendi.";
                            }
                            else
                            {
                                return "Kullanıcı eklenirken bir hata oluştu.";
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    return "Hata: " + ex.Message;
                }
            }


        [HttpPost]
        [Route("login")]
        public LoginResponseModel Login(LoginModel loginModel)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("project2DBcon").ToString();

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string query = "SELECT UserName, UserRole FROM dbo.Users " +
                                   "WHERE UserMail = @UserMail AND UserPassword = @UserPassword";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@UserMail", loginModel.UserMail);
                        cmd.Parameters.AddWithValue("@UserPassword", loginModel.UserPassword);

                        SqlDataReader reader = cmd.ExecuteReader();

                        if (reader.Read())
                        {
                            string username = reader["UserName"].ToString();
                            string userRole = reader["UserRole"].ToString();

                            
                            var responseModel = new LoginResponseModel
                            {
                                UserName = username,
                                UserRole = userRole
                            };

                            return responseModel;
                        }
                        else
                        {
                            return new LoginResponseModel
                            {
                                ErrorMessage = "Giriş başarısız. Kullanıcı adı veya şifre hatalı."
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return new LoginResponseModel
                {
                    ErrorMessage = "Hata: " + ex.Message
                };
            }
        }

        public class LoginModel
        {
            public string UserMail { get; set; }
            public string UserPassword { get; set; }
        }

        public class LoginResponseModel
        {
            public string UserName { get; set; }
            public string UserRole { get; set; }
            public string ErrorMessage { get; set; }
        }




        [HttpDelete]
            [Route("DeleteUser/{id}")]
            public JsonResult DeleteUser(int id)
            {
                string query = "DELETE FROM dbo.Users WHERE UserId = @UserId";
                string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", id);

                        int rowsAffected = myCommand.ExecuteNonQuery();

                        myCon.Close();

                        if (rowsAffected > 0)
                        {
                            return new JsonResult("Kullanıcı başarıyla silindi.");
                        }
                        else
                        {
                            return new JsonResult("Kullanıcı silinirken bir hata oluştu veya belirtilen ID bulunamadı.");
                        }
                    }
                }
            }





        }
    


 





    
}
