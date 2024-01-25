import React from 'react';
import dotenv from 'dotenv';
dotenv.config();
 
const apiKey = process.env.API_KEY; 
const Yelp = {
  search(term, location, sortBy) {
    const url = `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
    return fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.businesses) {
          return jsonResponse.businesses.map((business) => ({
            id: business.id,
            imageSrc: business.image_url,
            name: business.name,
            address: business.location.address1,
            city: business.location.city,
            state: business.location.state,
            zipCode: business.location.zip_code,
            category: business.categories[0].title,
            rating: business.rating,
            reviewCount: business.review_count,
          }));
        } else {
          throw new Error("Invalid response from Yelp API");
        }
      })
      .catch((error) => {
        console.log(error);
        throw new Error("Error fetching data from Yelp API");
      });
  },
};
 
class YelpErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
 
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
 
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }
 
    return this.props.children;
  }
}
 
export default { Yelp, YelpErrorBoundary };