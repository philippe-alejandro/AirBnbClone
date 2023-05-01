export default function PlaceImg({place, index=0}) {
  if (!place.photos?.length) {
    return "";
  }
  return (
    <img className="h-full object-cover" src={"http://localhost:3000/uploads/" + place.photos[0]} alt=""/>
  );  
}