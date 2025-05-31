import { useState } from 'react';
import { useParams } from 'react-router-dom';

const ImageUploader = ({ onUpload }) => {
  const { id: heroId } = useParams();

  const [file, setFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const uploadImage = async () => {
    setLoading(true);
    setError('');

    try {
      if (!heroId) throw new Error('Hero ID not found');

      let imageUrl = '';

      if (urlInput.trim()) {
        imageUrl = urlInput.trim();
      }

      else if (file instanceof File) {
        const formDataCloud = new FormData();
        formDataCloud.append('file', file);
        formDataCloud.append('upload_preset', 'UploadSH');

        const cloudRes = await fetch('https://api.cloudinary.com/v1_1/ds0wtcvdw/image/upload', {
          method: 'POST',
          body: formDataCloud,
        });

        const cloudData = await cloudRes.json();

        if (!cloudData.secure_url) throw new Error('ОCloudinary Upload Error');
        imageUrl = cloudData.secure_url;
      }

      else {
        throw new Error('Select a file or insert a link');
      }


      // Save to the database
      const saveRes = await fetch(`/api/heroes/${heroId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, isMain: false }),
      });

      if (!saveRes.ok) throw new Error('Error saving to DB');

      const savedImage = await saveRes.json();

      onUpload(savedImage);
      setFile(null);
      setUrlInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <p>Add an image:</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setUrlInput('');
        }}
      />

      <div style={{ margin: '1rem 0' }}>
        
      </div>

      <input
        type="text"
        placeholder="Insert image link"
        value={urlInput}
        onChange={(e) => {
          setUrlInput(e.target.value);
          setFile(null);
        }}
        style={{ width: '100%' }}
      />

      <button onClick={uploadImage} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Loading...' : 'Loading'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUploader;
