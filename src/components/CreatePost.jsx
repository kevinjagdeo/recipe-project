export function CreatePost() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input type='text' name='create-title' id='create-title' />
      </div>
      <br />
      <div>
        <label htmlFor='create-author'>Author: </label>
        <input type='text' name='create-author' id='create-author' />
      </div>
      <br />
      <div>
        <label htmlFor='create-content'>Content: </label>
        <textarea name='create-content' id='create-content' />
      </div>
      <br />
      <div>
        <label htmlFor='create-image-url'>Image URL: </label>
        <input type='text' name='create-image-url' id='create-image-url' />
      </div>
      <br />
      <input type='submit' value='Create' />
    </form>
  )
}
