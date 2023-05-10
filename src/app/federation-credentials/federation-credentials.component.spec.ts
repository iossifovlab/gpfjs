import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederationCredentialsComponent } from './federation-credentials.component';
import { Observable, of } from 'rxjs';
import { FederationCredential } from './federation-credentials';
import { UsersService } from 'app/users/users.service';

class MockUsersService {
  private credentials = [
    new FederationCredential('id1', 'secret1', 'name1'),
    new FederationCredential('id2', 'secret2', 'name2'),
    new FederationCredential('id3', 'secret3', 'name3')
  ];

  public getFederationCredentials(): Observable<FederationCredential[]> {
    return of(this.credentials);
  }

  public deleteFederationCredentials(name: string): Observable<null> {
    this.credentials = this.credentials.filter(credential => credential.name !== name);

    return of(null);
  }

  public createFederationCredentials(name: string): Observable<string> {
    const num = this.credentials.length + 1;
    this.credentials.push(new FederationCredential(`id${num}`, `secret${num}`, name));
    return of('secret new credential');
  }
}

describe('FederationCredentialsComponent', () => {
  let component: FederationCredentialsComponent;
  let fixture: ComponentFixture<FederationCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FederationCredentialsComponent
      ],
      providers: [
        {provide: UsersService, useValue: new MockUsersService()}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FederationCredentialsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize credentials', () => {
    expect(component.credentials).toBeUndefined();
    component.ngOnInit();
    expect(component.credentials).toStrictEqual([
      new FederationCredential('id1', 'secret1', 'name1'),
      new FederationCredential('id2', 'secret2', 'name2'),
      new FederationCredential('id3', 'secret3', 'name3')
    ]);
  });

  it('should delete credentials', () => {
    fixture.detectChanges();
    expect(component.credentials).toStrictEqual([
      new FederationCredential('id1', 'secret1', 'name1'),
      new FederationCredential('id2', 'secret2', 'name2'),
      new FederationCredential('id3', 'secret3', 'name3')
    ]);

    component.deleteCredential('name2');
    expect(component.credentials).toStrictEqual([
      new FederationCredential('id1', 'secret1', 'name1'),
      new FederationCredential('id3', 'secret3', 'name3')
    ]);
  });

  it('should create credential', () => {
    fixture.detectChanges();
    expect(component.credentials).toStrictEqual([
      new FederationCredential('id1', 'secret1', 'name1'),
      new FederationCredential('id2', 'secret2', 'name2'),
      new FederationCredential('id3', 'secret3', 'name3')
    ]);

    component.createCredential('');
    expect(component.credentials).toStrictEqual([
      new FederationCredential('id1', 'secret1', 'name1'),
      new FederationCredential('id2', 'secret2', 'name2'),
      new FederationCredential('id3', 'secret3', 'name3')
    ]);

    component.createCredential('name4');
    fixture.detectChanges();
    expect(component.credentials).toStrictEqual([
      new FederationCredential('id1', 'secret1', 'name1'),
      new FederationCredential('id2', 'secret2', 'name2'),
      new FederationCredential('id3', 'secret3', 'name3'),
      new FederationCredential('id4', 'secret4', 'name4')
    ]);
    expect(component.temporaryShownCredentials).toBe('secret new credential');
    expect(document.getElementById('credential-modal-content').textContent).toBe('secret new credential');
  });
});