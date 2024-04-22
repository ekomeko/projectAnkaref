using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using static project2.Controllers.UserController;

namespace project2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class categoryController : ControllerBase
    {
        private IConfiguration _configuration;
        public categoryController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetCategorys")]
        public JsonResult GetCategorys()
        {
            string query = "select * from dbo.Categorys";
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

        public class Category
        {
            public string CategoryName { get; set; }

        }

        [HttpPost]
        [Route("AddCategorys")]
        public JsonResult AddCategorys([FromBody] Category newCategory)
        {
            string query = "INSERT INTO dbo.Categorys (CategoryName) VALUES (@CategoryName)";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@CategoryName", newCategory.CategoryName);


                    int rowsAffected = myCommand.ExecuteNonQuery();

                    myCon.Close();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Kategori başarıyla eklendi.");
                    }
                    else
                    {
                        return new JsonResult("Kategori eklenirken bir hata oluştu.");
                    }
                }
            }
        }
        [HttpDelete]
        [Route("DeleteCategory/{id}")]
        public JsonResult DeleteCategory(int id)
        {
            string query = "DELETE FROM dbo.Categorys WHERE CategoryId = @CategoryId";
            string sqlDatasource = _configuration.GetConnectionString("project2DBcon");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@CategoryId", id);

                    int rowsAffected = myCommand.ExecuteNonQuery();

                    myCon.Close();

                    if (rowsAffected > 0)
                    {
                        return new JsonResult("Kategori başarıyla silindi.");
                    }
                    else
                    {
                        return new JsonResult("Kategori silinirken bir hata oluştu veya belirtilen ID bulunamadı.");
                    }
                }
            }
        }

    }
}
