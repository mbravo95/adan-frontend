import styled from "styled-components";

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  width: 100%;
  margin-top: 70px;
  display: flex;
  box-sizing: border-box;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  box-sizing: border-box;
  min-height: calc(100vh - 60px);
`;

const CourseTitle = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 30px;
  font-weight: 600;
  border-bottom: 2px solid #4C241D;
  padding-bottom: 10px;
`;

const ParticipantsButton = styled.button`
  width: 100%;
  background-color: black;
  color: white;
  border: none;
  padding: 14px 12px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #333;
    transform: translateY(0);
  }
`;

const IndexSection = styled.div`
  margin-top: 20px;
`;

const IndexTitle = styled.h2`
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
`;

const IndexList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const IndexItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4C241D;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const CourseInfoHeader = styled.div`
  width: calc(100% - 40px);
  /*background-color: #c0386eff;*/
  background-color: ${props => props.bg};
  color: white;
  padding: 15px 25px;
  margin: 20px;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourseImageContainer = styled.div`
  img {
    width: 150px; 
    height: auto;
    object-fit: contain;
  }

  /*margin: -15px;
  margin-right: -35px;*/
`;

const CourseInfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  max-width: 500px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color : black;

  &.inline {
  flex-direction: row;
  gap: 6px;
}
`;

const InfoLabel = styled.div`
  font-size: 30px;
  font-weight: 600;
  /*text-transform: uppercase;*/
  letter-spacing: 1px;
  color: black;
`;

const InfoValue = styled.div`
  font-size: 19px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 3px;
  color: black;
`;

const AddSectionButton = styled.button`
  background-color: #ffffffff;
  color: black;
  width: calc(100% - 40px);
  text-align: left;
  border: 1px solid grey;
  padding: 12px 24px;
  margin: 0 20px 20px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  
  &:hover {
    background-color: #d7d7d7ff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const UploadMaterialButton = styled.button`
  width: 100%;
  background-color: #050505ff;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  text-align: center;

`;

const SectionsContainer = styled.div`
  margin: 0 20px;
  padding: 0;
`;

const SectionPlaceholder = styled.div`
  background-color: #f8f9fa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4C241D;
    background-color: #f5f5f5;
  }
`;

const SectionHeader = styled.div`
  
  position: relative; /* importante */

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.collapsed ? '0' : '15px'};
  cursor: pointer;
  padding: 10px 0;
  
  &:hover {
    background-color: rgba(76, 36, 29, 0.05);
  }

  &.cartelera-header {
    padding-top: 25px;
    padding-bottom: 25px;
  }
`;

const SectionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const RightIconContainer = styled.div`
  /*display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  opacity: 0.2;*/

  position: absolute;
  right: -25px;   /* sobresale hacia afuera */
  top: 50%;
  transform: translateY(-50%);
  width: 85;
  height: 85;
  opacity: 0.2;
  pointer-events: none; /* no bloquea el click */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25px;
`;

const CollapseIcon = styled.span`
  font-size: 16px;
  color: #000000ff;
  transition: transform 0.3s ease;
  transform: ${props => props.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};
`;

const SectionContent = styled.div`
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  max-height: ${props => props.collapsed ? '0' : 'none'};
  padding: ${props => props.collapsed ? '0' : '10px 0'};
`;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  /*background-color: ${props => props.variant === 'danger' ? '#dc3545' : props.variant === 'warning' ? '#ffc107' : '#28a745'};*/
  background-color: '#dededeff';
  /*color: ${props => props.variant === 'warning' ? '#000' : '#fff'};*/
  color: #000;
  border: 1px solid #4b4b4bff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SectionSubtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 15px 0;
  font-style: italic;
`;

const SectionDescription = styled.p`
  color: #555;
  font-size: 14px;
  margin: 5px 0;
  line-height: 1.4;
`;

const SectionInfo = styled.div`
  margin-bottom: 10px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
  font-style: italic;
`;

const NoSectionsMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
  background-color: #f8f9fa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  
  h3 {
    color: #666;
    margin-bottom: 10px;
  }
  
  p {
    margin: 5px 0;
  }
`;

const Recurso = styled.a`
  color: #222;
  &:hover {
    text-decoration: underline;
    color: blue;
    cursor: pointer;
  }
`;

export {
    Container,
    Sidebar,
    CourseTitle,
    ParticipantsButton,
    IndexSection,
    IndexTitle,
    IndexList,
    IndexItem,
    MainContent,
    CourseInfoHeader,
    CourseImageContainer,
    CourseInfoGrid,
    InfoSection,
    InfoLabel,
    InfoValue,
    AddSectionButton,
    UploadMaterialButton,
    SectionsContainer,
    SectionPlaceholder,
    SectionHeader,
    SectionTitleContainer,
    RightIconContainer,
    CollapseIcon,
    SectionContent,
    SectionTitle,
    ButtonGroup,
    ActionButton,
    SectionSubtitle,
    SectionDescription,
    SectionInfo,
    LoadingMessage,
    NoSectionsMessage,
    Recurso
}