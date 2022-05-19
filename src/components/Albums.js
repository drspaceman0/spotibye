const Albums = ({ albums }) => {
  if (typeof albums === "undefined" || !albums) return null;

  return (
    <div id="user-albums">
      <table className="albums-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Album</th>
            <th>Artist</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <tr key={album.id}>
              <td>
                <img src={album.img} alt={album.name} />
              </td>
              <td>{album.name}</td>
              <td>{album.artist}</td>
              <td>{album.dateAdded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Albums;
