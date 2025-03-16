using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Task1.Models
{
    public class Approval
    {
        [Key]
        public int ApprovalId { get; set; }

        [ForeignKey("Document")]
        public int DocumentId { get; set; }

        [Required]
        public string ReviewedBy { get; set; }

        [Required]
        public string ReviewStatus { get; set; } 

        public string Comments { get; set; }

        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;

        public Document Document { get; set; }
    }
}
