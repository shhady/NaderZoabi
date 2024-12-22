const FileDownloadLink = ({ file }) => {
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(file.storagePath);

      if (error) throw error;

      // Create a download link
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('שגיאה בהורדת הקובץ');
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
      <span>{file.fileName}</span>
      <button
        onClick={handleDownload}
        className="text-[#B78628] hover:text-[#96691E]"
      >
        הורד
      </button>
    </div>
  );
}; 