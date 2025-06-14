'use client';

/**
 * 블로그 헤더 및 네비게이션 컴포넌트
 * 반응형 디자인과 접근성을 고려한 네비게이션 제공
 */

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, PlusCircle } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentPath } from '@/hooks/use-pathname';

// 네비게이션 메뉴 항목 타입 정의
interface NavItem {
  name: string;
  href: string;
  description: string;
}

// 네비게이션 메뉴 목록
const navItems: NavItem[] = [
  { name: '홈', href: '/', description: '세계 음식 블로그 메인으로 이동' },
  { name: '음식 이야기', href: '/posts', description: '세계 음식/문화/여행 이야기 모아보기' },
  { name: '카테고리', href: '/categories', description: '음식 종류별로 탐색하기' },
  { name: '소개', href: '/about', description: '블로그와 운영자 소개' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isActivePath } = useCurrentPath();

  /**
   * 모바일 메뉴 닫기 핸들러
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * 네비게이션 링크 스타일 생성
   * @param href - 링크 경로
   * @returns 스타일 클래스명
   */
  const getNavLinkStyles = (href: string) => {
    const baseStyles = "text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1";
    const activeStyles = "text-primary font-semibold";
    const inactiveStyles = "text-muted-foreground";
    
    return `${baseStyles} ${isActivePath(href) ? activeStyles : inactiveStyles}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          
          {/* 로고/브랜드명 */}
          <div className="flex items-center space-x-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label="세계 음식 블로그 메인으로 이동"
            >
              <div className="h-8 w-8 rounded-md bg-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg" aria-hidden="true">
                  🍽️
                </span>
              </div>
              <span className="font-bold text-xl text-amber-700">세계 음식 블로그</span>
            </Link>
          </div>

          {/* 데스크탑 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="주 네비게이션">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkStyles(item.href)}
                aria-current={isActivePath(item.href) ? 'page' : undefined}
                title={item.description}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center space-x-4">
            {/* 인증 상태에 따른 버튼 */}
            <SignedIn>
              {/* 관리자 메뉴 - 새 글 작성 */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden md:flex items-center gap-2"
              >
                <Link href="/admin/posts/create">
                  <PlusCircle className="h-4 w-4" />
                  음식글 작성
                </Link>
              </Button>
              
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-xl"
                  }
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                >
                  로그인
                </Button>
              </SignInButton>
            </SignedOut>

            {/* 모바일 햄버거 메뉴 */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    aria-label="메뉴 열기"
                    title="네비게이션 메뉴"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>음식/여행 메뉴</SheetTitle>
                    <SheetDescription>
                      세계의 다양한 음식과 문화를 탐험하세요.
                    </SheetDescription>
                  </SheetHeader>
                  
                  {/* 모바일 메뉴 닫기 버튼 */}
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeMobileMenu}
                      className="h-8 w-8 p-0"
                      aria-label="메뉴 닫기"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 모바일 네비게이션 링크들 */}
                  <nav className="flex flex-col space-y-4 mt-6" role="navigation" aria-label="모바일 네비게이션">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`text-lg font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-3 py-2 ${
                          isActivePath(item.href) 
                            ? 'text-primary font-semibold bg-primary/5' 
                            : 'text-muted-foreground'
                        }`}
                        aria-current={isActivePath(item.href) ? 'page' : undefined}
                      >
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </nav>

                  {/* 모바일 관리자 메뉴 */}
                  <SignedIn>
                    <div className="mt-8 pt-6 border-t space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">관리자</h4>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link
                          href="/admin/posts/create"
                          onClick={closeMobileMenu}
                          aria-label="음식글 작성"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          음식글 작성
                        </Link>
                      </Button>
                    </div>
                  </SignedIn>

                  {/* 모바일 인증 옵션 */}
                  <div className="mt-8 pt-6 border-t space-y-4">
                    <SignedIn>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">계정</h4>
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8",
                              userButtonPopoverCard: "shadow-xl"
                            }
                          }}
                        />
                      </div>
                    </SignedIn>

                    <SignedOut>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">계정</h4>
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            className="w-full justify-center"
                          >
                            로그인
                          </Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}