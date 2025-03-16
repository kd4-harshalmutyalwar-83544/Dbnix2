using System.ComponentModel.DataAnnotations;

namespace Task1.Models
{
    public class FileUpload
    {
            [Key]
            public int Id { get; set; }

            public string FileName { get; set; }

            public int Status { get; set; }

            public bool IsDownloadable { get; set; } = false; 

             public byte[] FileData { get; set; }
    }
}
