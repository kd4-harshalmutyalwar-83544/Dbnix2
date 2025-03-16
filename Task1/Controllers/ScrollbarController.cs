using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using Task1.DTO;
using Task1.Models;

namespace Task1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScrollbarController : ControllerBase
    {
        private readonly Task1Context _context;
        private readonly string _uploadPath = "Uploads";

        public ScrollbarController(Task1Context context)
        {
            _context = context;
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var fileUpload = new FileUpload
            {
                FileName = file.FileName,
                FileData = memoryStream.ToArray(),
                Status = 0
            };

            _context.FileUploads.Add(fileUpload);
            await _context.SaveChangesAsync();

            return Ok(new { message = "File uploaded successfully", fileId = fileUpload.Id });
        }



        [HttpGet("status/{id}")]
        public IActionResult GetStatus(int id)
        {
            var fileUpload = _context.FileUploads.FirstOrDefault(f => f.Id == id);
            if (fileUpload == null)
                return NotFound(new { message = "File not found" });

            return Ok(new { status = fileUpload.Status, isDownloadable = fileUpload.IsDownloadable });
        }

        [HttpPost("review/{id}")]
        public async Task<IActionResult> MoveToReview(int id)
        {
            var fileUpload = _context.FileUploads.FirstOrDefault(f => f.Id == id);
            if (fileUpload == null)
                return NotFound(new { message = "File not found" });

            if (fileUpload.Status != 0)
                return BadRequest("File is already being reviewed or processed");

            fileUpload.Status = 1;
            await _context.SaveChangesAsync();

            return Ok(new { message = "File moved to review stage", status = fileUpload.Status });
        }


        [HttpPost("reject/{id}")]
        public async Task<IActionResult> RejectFile(int id)
        {
            var fileUpload = _context.FileUploads.FirstOrDefault(f => f.Id == id);
            if (fileUpload == null)
                return NotFound(new { message = "File not found" });

            fileUpload.Status = 2;
            fileUpload.IsDownloadable = false; 
            await _context.SaveChangesAsync();

            return Ok(new { message = "File rejected", status = fileUpload.Status });
        }

        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveStep2(int id)
        {
            var fileUpload = _context.FileUploads.FirstOrDefault(f => f.Id == id);
            if (fileUpload == null)
                return NotFound(new { message = "File not found" });

            if (fileUpload.Status != 1)
                return BadRequest("File is not in review stage");

            fileUpload.Status = 3; 
            await _context.SaveChangesAsync();

            return Ok(new { message = "File approved for final stage", status = fileUpload.Status });
        }

        [HttpPost("final-approve/{id}")]
        public async Task<IActionResult> FinalApproval(int id)
        {
            var fileUpload = _context.FileUploads.FirstOrDefault(f => f.Id == id);
            if (fileUpload == null)
                return NotFound(new { message = "File not found" });

            if (fileUpload.Status != 3)
                return BadRequest("File is not in final approval stage");

            fileUpload.IsDownloadable = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "File approved, download enabled", status = fileUpload.Status });
        }


    }
}
