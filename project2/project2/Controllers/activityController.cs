using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;

namespace project2.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ActivityController : ControllerBase
    {
        private IConfiguration _configuration;
        public ActivityController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetAllActivities")]
        public JsonResult GetAllActivities()
        {
            string query = "SELECT * FROM dbo.Activities";
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

        [HttpGet]
        [Route("GetActivityById/{id}")]
        public JsonResult GetActivityById(int id)
        {
            string query = $"SELECT * FROM dbo.Activities WHERE CategoryId = {id}";
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

        [HttpPost]
        [Route("AddActivity")]
        public JsonResult AddActivity([FromBody] Activity newActivity)
        {
            string query = "INSERT INTO dbo.Activities (CategoryId, ActivityTitle, ActivityDescription, ActivityDate, CreatedByUserId, ActivityCompletionDate) OUTPUT INSERTED.ActivityId VALUES (@CategoryId, @ActivityTitle, @ActivityDescription, @ActivityDate, @CreatedByUserId, @ActivityCompletionDate)";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@CategoryId", newActivity.CategoryId);
                    myCommand.Parameters.AddWithValue("@ActivityTitle", newActivity.ActivityTitle);
                    myCommand.Parameters.AddWithValue("@ActivityDescription", newActivity.ActivityDescription);
                    myCommand.Parameters.AddWithValue("@ActivityDate", newActivity.ActivityDate);
                    myCommand.Parameters.AddWithValue("@CreatedByUserId", newActivity.CreatedByUserId);
                    myCommand.Parameters.AddWithValue("@ActivityCompletionDate", newActivity.ActivityCompletionDate);

                    // Retrieve the inserted ActivityId
                    int addedActivityId = (int)myCommand.ExecuteScalar();

                    myCon.Close();

                    if (addedActivityId > 0)
                    {
                        // Return the ActivityId in the response
                        return new JsonResult(new { ActivityId = addedActivityId, Message = "Bildirim başarıyla eklendi." });
                    }
                    else
                    {
                        return new JsonResult("Bildirim eklenirken bir hata oluştu.");
                    }
                }
            }
        }





        [HttpPut]
        [Route("UpdateActivity")]
        public JsonResult UpdateActivity([FromBody] Activity updatedActivity)
        {
            string query = "UPDATE dbo.Activities SET CategoryId = @CategoryId, ActivityTitle = @ActivityTitle, ActivityDescription = @ActivityDescription, ActivityDate = @ActivityDate, CreatedByUserId = @CreatedByUserId, ActivityCompletionDate = @ActivityCompletionDate, ActivityCompletionHour = @ActivityCompletionHour WHERE ActivityId = @ActivityId";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@CategoryId", updatedActivity.CategoryId);
                    myCommand.Parameters.AddWithValue("@ActivityTitle", updatedActivity.ActivityTitle);
                    myCommand.Parameters.AddWithValue("@ActivityDescription", updatedActivity.ActivityDescription);
                    myCommand.Parameters.AddWithValue("@ActivityDate", updatedActivity.ActivityDate);
                    myCommand.Parameters.AddWithValue("@CreatedByUserId", updatedActivity.CreatedByUserId);
                    myCommand.Parameters.AddWithValue("@ActivityCompletionDate", updatedActivity.ActivityCompletionDate);



                    int rowsAffected = myCommand.ExecuteNonQuery();

                    myCon.Close();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Faaliyet başarıyla güncellendi.");
                    }
                    else
                    {
                        return new JsonResult("Faaliyet güncellenirken bir hata oluştu veya belirtilen ID bulunamadı.");
                    }
                }
            }
        }



        [HttpDelete]
        [Route("DeleteActivity/{id}")]
        public JsonResult DeleteActivity(int id)
        {
            string query = "DELETE FROM dbo.Activities WHERE ActivityId = @ActivityId";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ActivityId", id);

                    int rowsAffected = myCommand.ExecuteNonQuery();

                    myCon.Close();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Faaliyet başarıyla silindi.");
                    }
                    else
                    {
                        return new JsonResult("Faaliyet silinirken bir hata oluştu veya belirtilen ID bulunamadı.");
                    }
                }
            }
        }
    }




    public class Activity
{
    public int CategoryId { get; set; }
    public string ActivityTitle { get; set; }
    public string ActivityDescription { get; set; }
    public DateTime ActivityDate { get; set; }
    public int CreatedByUserId { get; set; }
    public DateTime ActivityCompletionDate { get; set; }
}

}
