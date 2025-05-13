import React from "react";
import { Link } from "react-router-dom";
import { NavSection, SidebarSectionConfig } from "../types/navTypes";
import { ChevronDown, ChevronRight } from "lucide-react";
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

type SectionGroupProps = {
  section: NavSection | SidebarSectionConfig;
  isOpen: boolean;
  toggleSection: () => void;
  isSectionActive: (paths: string[]) => boolean;
  isActive: (path: string) => boolean;
  isCollapsed: boolean;
};

const SectionGroup = ({ 
  section, 
  isOpen, 
  toggleSection, 
  isSectionActive, 
  isActive, 
  isCollapsed 
}: SectionGroupProps) => {
  // Get the section label based on type, checking for both label and title properties
  const sectionLabel = 'label' in section ? section.label : ('title' in section ? section.title : '');
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Additional mobile handling for section header
  const [touchStartTime, setTouchStartTime] = React.useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // If tap is less than 300ms, consider it a click
    if (touchStartTime && (Date.now() - touchStartTime < 300)) {
      e.preventDefault();
      toggleSection();
    }
    setTouchStartTime(null);
  };

  const mobileTouchProps = isMobileDevice ? {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  } : {};
  
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={toggleSection} 
              isActive={isSectionActive(section.items.map(item => item.to))}
              tooltip={isCollapsed ? sectionLabel : undefined}
              {...mobileTouchProps}
            >
              <section.icon size={20} />
              <span>{sectionLabel}</span>
              {isOpen ? 
                <ChevronDown size={16} className="ml-auto" /> : 
                <ChevronRight size={16} className="ml-auto" />
              }
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isOpen && (
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.to)}
                    tooltip={isCollapsed ? item.label : undefined}
                  >
                    <Link to={item.to}>
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SectionGroup;
