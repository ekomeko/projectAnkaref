using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace project2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private IConfiguration _configuration;

        public ParticipantsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetParticipants")]
        public JsonResult GetParticipants()
        {
            string query = "SELECT * FROM dbo.participants";
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
        [Route("AddParticipant")]
        public JsonResult AddParticipant([FromBody] Participant newParticipant)
        {
            string query = "INSERT INTO dbo.participants (ActivityId, UserId, ConfirmationStatus) VALUES (@ActivityId, @UserId, @ConfirmationStatus)";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ActivityId", newParticipant.ActivityId);
                    myCommand.Parameters.AddWithValue("@UserId", newParticipant.UserId);
                    myCommand.Parameters.AddWithValue("@ConfirmationStatus", newParticipant.ConfirmationStatus);

                    int rowsAffected = myCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Katılımcı başarıyla eklendi.");
                    }
                    else
                    {
                        return new JsonResult("Katılımcı eklenirken bir hata oluştu.");
                    }
                }
            }
        }

        [HttpDelete]
        [Route("DeleteParticipant/{id}")]
        public JsonResult DeleteParticipant(int id)
        {
            string query = "DELETE FROM dbo.participants WHERE ParticipantId = @ParticipantId";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ParticipantId", id);

                    int rowsAffected = myCommand.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Katılımcı başarıyla silindi.");
                    }
                    else
                    {
                        return new JsonResult("Katılımcı silinirken bir hata oluştu veya belirtilen ID bulunamadı.");
                    }
                }
            }
        }


    }

    public class Participant
    {
        public int ActivityId { get; set; }
        public int UserId { get; set; }
        public string ConfirmationStatus { get; set; }
    }
}
