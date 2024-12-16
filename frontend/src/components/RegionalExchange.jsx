import React, { useState, useEffect } from 'react';
import Header from './Header';
import './RegionalExchange.css';

const RegionalExchange = ({ handleLogout, username, isLoggedIn }) => {
  const [selectedRegion, setSelectedRegion] = useState({
    province: '',
    city: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 임시 도서 데이터
  const tempBooks = [
    {
      id: 1,
      title: '해리포터와 마법사의 돌',
      author: 'J.K. 롤링',
      coverImage: 'https://via.placeholder.com/150',
      location: '서울특별시 강남구'
    },
    {
      id: 2,
      title: '어린왕자',
      author: '생텍쥐페리',
      coverImage: 'https://via.placeholder.com/150',
      location: '서울특별시 서초구'
    },
    {
      id: 3,
      title: '데미안',
      author: '헤르만 헤세',
      coverImage: 'https://via.placeholder.com/150',
      location: '경기도 성남시'
    },
    // ... 더 많은 임시 데이터 추가 가능
  ];

  // 검색 함수 (임시 구현)
  const searchBooks = () => {
    setIsLoading(true);
    
    // 검색 로직 임시 구현
    setTimeout(() => {
      const filteredBooks = tempBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProvince = !selectedRegion.province || book.location.includes(selectedRegion.province);
        const matchesCity = !selectedRegion.city || book.location.includes(selectedRegion.city);
        
        return matchesSearch && matchesProvince && matchesCity;
      });
      
      setSearchResults(filteredBooks);
      setIsLoading(false);
    }, 500); // 실제 API 호출을 흉내내기 위한 지연
  };

  // 검색어나 지역 변경시 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBooks();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedRegion]);

  /* 나중에 실제 API 연동 시 사용할 코드 (주석처리)
  const searchBooks = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/books/search?term=${searchTerm}&province=${selectedRegion.province}&city=${selectedRegion.city}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('책 검색 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };
  */

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 한국 지역 데이터
  const regions = {
    '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '경기도': ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시', '화성시', '평택시', '의정부시', '시흥시', '파주시', '광명시', '김포시', '군포시', '광주시', '이천시', '양주시', '오산시', '구리시', '포천시', '하남시', '여주시', '양평군', '동두천시', '과천시', '가평군', '연천군'],
    '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
    '부산광역시': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
    '대구광역시': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
    '광주광역시': ['동구', '서구', '남구', '북구', '광산구'],
    '대전광역시': ['동구', '중구', '서구', '유성구', '대덕구'],
    '울산광역시': ['중구', '남구', '동구', '북구', '울주군'],
    '강원도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
    '충청북도': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
    '전라북도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
    '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
    '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
    '제주특별자치도': ['제주시', '서귀포시']
  };

  const handleRegionChange = (e) => {
    setSelectedRegion({
      ...selectedRegion,
      province: e.target.value,
      city: ''
    });
  };

  const handleCityChange = (e) => {
    setSelectedRegion({
      ...selectedRegion,
      city: e.target.value
    });
  };

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />
      <div className="regional-exchange-container">
        <h2>지역별 도서 교환</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="책 제목을 입력하세요"
            value={searchTerm}
            onChange={handleSearchChange}
            className="book-search-input"
          />
        </div>
        <div className="region-selector">
          <select 
            value={selectedRegion.province}
            onChange={handleRegionChange}
            className="region-select"
          >
            <option value="">시/도 선택</option>
            {Object.keys(regions).map(province => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select 
            value={selectedRegion.city}
            onChange={handleCityChange}
            className="region-select"
            disabled={!selectedRegion.province}
          >
            <option value="">시/군/구 선택</option>
            {selectedRegion.province && regions[selectedRegion.province].map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="search-results">
          {isLoading ? (
            <div className="loading">검색 중...</div>
          ) : (
            <div className="books-grid">
              {searchResults.map((book) => (
                <div key={book.id} className="book-card">
                  <img src={book.coverImage} alt={book.title} />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <p>{book.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RegionalExchange;