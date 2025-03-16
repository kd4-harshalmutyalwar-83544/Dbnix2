using System.ComponentModel.DataAnnotations;

namespace Task1.Models
{
    public class Document
    {
        [Key]
        public int DocumentId { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string FilePath { get; set; }

        [Required]
        public string UploadedBy { get; set; }

        public string Status { get; set; } = "Uploaded";

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
}
