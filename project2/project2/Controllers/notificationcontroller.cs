using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Data.SqlClient;

namespace project2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private IConfiguration _configuration;

        public NotificationsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetNotifications")]
        public JsonResult GetNotifications()
        {
            string query = "SELECT * FROM dbo.notifications";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    SqlDataReader myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
            }
            return new JsonResult(table);
        }

        [HttpPost]
        [Route("AddNotification")]
        public JsonResult AddNotification([FromBody] Notification newNotification)
        {
            string query = "INSERT INTO dbo.notifications (UserId, Content, NotificationDate) VALUES (@UserId, @Content, @NotificationDate)";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@UserId", newNotification.UserId);
                    myCommand.Parameters.AddWithValue("@Content", newNotification.Content);
                    myCommand.Parameters.AddWithValue("@NotificationDate", DateTime.Now); // Bildirim tarihi otomatik olarak şu anki tarih ve saat olacak

                    int rowsAffected = myCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Bildirim başarıyla eklendi.");
                    }
                    else
                    {
                        return new JsonResult("Bildirim eklenirken bir hata oluştu.");
                    }
                }
            }
        }

        [HttpDelete]
        [Route("DeleteNotification/{id}")]
        public JsonResult DeleteNotification(int id)
        {
            string query = "DELETE FROM dbo.notifications WHERE NotificationId = @NotificationId";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@NotificationId", id);

                    int rowsAffected = myCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Bildirim başarıyla silindi.");
                    }
                    else
                    {
                        return new JsonResult("Bildirim silinirken bir hata oluştu veya belirtilen ID bulunamadı.");
                    }
                }
            }
        }


    }

    public class Notification
    {
        public int UserId { get; set; }
        public string Content { get; set; }
    }
}
