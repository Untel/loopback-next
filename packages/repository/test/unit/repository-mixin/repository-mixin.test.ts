// Copyright IBM Corp. 2013,2017. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {
  RepositoryMixin,
  juggler,
  DataSourceConstructor,
  Class,
} from '../../../';
import {Application, Component} from '@loopback/core';

// tslint:disable:no-any

describe('RepositoryMixin', () => {
  it('mixed class has .repository()', () => {
    const myApp = new appWithRepoMixin();
    expect(typeof myApp.repository).to.be.eql('function');
  });

  it('binds repository from constructor', () => {
    const myApp = new appWithRepoMixin({
      repositories: [NoteRepo],
    });

    expectNoteRepoToBeBound(myApp);
  });

  it('binds repository from app.repository()', () => {
    const myApp = new appWithRepoMixin();

    expectNoteRepoToNotBeBound(myApp);
    myApp.repository(NoteRepo);
    expectNoteRepoToBeBound(myApp);
  });

  it('binds user defined component without repository', () => {
    class EmptyTestComponent {}

    const myApp = new appWithRepoMixin({
      components: [EmptyTestComponent],
    });

    expectComponentToBeBound(myApp, EmptyTestComponent);
  });

  it('binds user defined component with repository in constructor', () => {
    const myApp = new appWithRepoMixin({
      components: [TestComponent],
    });

    expectNoteRepoToBeBound(myApp);
  });

  it('binds user defined component with repository from .component()', () => {
    const myApp = new appWithRepoMixin();

    const boundComponentsBefore = myApp.find('components.*').map(b => b.key);
    expect(boundComponentsBefore).to.be.empty();
    expectNoteRepoToNotBeBound(myApp);

    myApp.component(TestComponent);

    expectComponentToBeBound(myApp, TestComponent);
    expectNoteRepoToBeBound(myApp);
  });

  const appWithRepoMixin = RepositoryMixin(Application);

  class NoteRepo {
    model: any;

    constructor() {
      const ds: juggler.DataSource = new DataSourceConstructor({
        name: 'db',
        connector: 'memory',
      });

      this.model = ds.createModel(
        'note',
        {title: 'string', content: 'string'},
        {},
      );
    }
  }

  class TestComponent {
    repositories = [NoteRepo];
  }

  function expectNoteRepoToBeBound(myApp: Application) {
    const boundRepositories = myApp.find('repositories.*').map(b => b.key);
    expect(boundRepositories).to.containEql('repositories.NoteRepo');
    const repoInstance = myApp.getSync('repositories.NoteRepo');
    expect(repoInstance).to.be.instanceOf(NoteRepo);
  }

  function expectNoteRepoToNotBeBound(myApp: Application) {
    const boundRepos = myApp.find('repositories.*').map(b => b.key);
    expect(boundRepos).to.be.empty();
  }

  function expectComponentToBeBound(
    myApp: Application,
    component: Class<Component>,
  ) {
    const boundComponents = myApp.find('components.*').map(b => b.key);
    expect(boundComponents).to.containEql(`components.${component.name}`);
    const componentInstance = myApp.getSync(`components.${component.name}`);
    expect(componentInstance).to.be.instanceOf(component);
  }
});
