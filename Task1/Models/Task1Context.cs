using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Task1.Models;

public partial class Task1Context : DbContext
{
    public Task1Context()
    {
    }

    public Task1Context(DbContextOptions<Task1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Loan> Loans { get; set; }
    public virtual DbSet<Login> Login { get; set; }
    public virtual DbSet<Document> Documents { get; set; }
    public virtual DbSet<Approval> Approvals { get; set; }
    public virtual DbSet<FileUpload> FileUploads { get; set; }
    public virtual DbSet<Employee> Employee { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {

        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Loan>(entity =>
        {
            entity.HasKey(e => e.LoanId).HasName("PK__Loan__4F5AD4578BF89069");

            entity.ToTable("Loan");

            entity.HasIndex(e => e.LoanNo, "UQ__Loan__4F5B1D621988DBB1").IsUnique();

            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.LoanNo)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
